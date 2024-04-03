import { create, getNumericDate, Header, Payload } from "https://deno.land/x/djwt/mod.ts";

async function pemToCryptoKey(pem: string): Promise<CryptoKey> {
	// Ta bort PEM-huvud och -fot samt omvandla till en enda rad
	const pemHeader = "-----BEGIN PRIVATE KEY-----";
	const pemFooter = "-----END PRIVATE KEY-----";
	const pemContents = pem.replace(pemHeader, "").replace(pemFooter, "").replace(/\s/g, "");

	// Dekodera base64-strängen till en Uint8Array
	const binaryDerString = atob(pemContents);
	const binaryDer = new Uint8Array(binaryDerString.length);
	Array.from(binaryDerString).forEach((char, index) => {
		binaryDer[index] = char.charCodeAt(0);
	});

	// Importera nyckeln till Web Crypto API
	return await crypto.subtle.importKey(
		"pkcs8",
		binaryDer,
		{
			name: "RSASSA-PKCS1-v1_5",
			hash: { name: "SHA-256" },
		},
		false,
		["sign"]
	);
}

const createJwt = async (serviceAccountEmail: string, privateKey: string, scope: string) => {
	const iat = getNumericDate(new Date());
	const exp = getNumericDate(new Date(Date.now() + 3600 * 1000)); // 1 hour from now

	const header: Header = {
		alg: "RS256",
		typ: "JWT",
	};

	const payload: Payload = {
		iss: serviceAccountEmail,
		scope: scope,
		aud: "https://oauth2.googleapis.com/token",
		exp: exp,
		iat: iat,
	};

	const cryptoKey = await pemToCryptoKey(privateKey);
	const jwt = await create(header, payload, cryptoKey);
	return jwt;
};

const getAccessToken = async (jwt: string) => {
	const response = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
			assertion: jwt,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		return data.access_token as string;
	} else {
		throw new Error("Failed to obtain access token");
	}
};

interface EventItem {
	start: { dateTime: string; timeZone: string };
	end: { dateTime: string; timeZone: string };
}

function isTimeSlotAvailable(
	items: EventItem[],
	startDateTime: string,
	endDateTime: string
): boolean {
	const startTime = new Date(startDateTime).getTime();
	const endTime = new Date(endDateTime).getTime();

	for (const item of items) {
		const eventStart = new Date(item.start.dateTime).getTime();
		const eventEnd = new Date(item.end.dateTime).getTime();

		// Kontrollera om start- eller sluttiden för det nya mötet överlappar med någon befintlig händelse
		if (
			(startTime >= eventStart && startTime < eventEnd) ||
			(endTime > eventStart && endTime <= eventEnd) ||
			(startTime <= eventStart && endTime >= eventEnd)
		) {
			// Tiden är upptagen
			return false;
		}
	}

	// Tiden är ledig
	return true;
}

type AddCalendarEventConfig = {
	serviceAccountEmail: string;
	privateKey: string;
	calendarId: string;
	eventStart: string;
	eventEnd: string;
	summary: string;
	description: string;
};

export default async function addCalendarEvent({
	serviceAccountEmail,
	privateKey,
	calendarId,
	eventStart,
	eventEnd,
	summary,
	description,
}: AddCalendarEventConfig): Promise<string> {
	const jwt = await createJwt(
		serviceAccountEmail,
		privateKey,
		"https://www.googleapis.com/auth/calendar"
	);
	const accessToken = await getAccessToken(jwt);

	// Steg 1: Validera att eventtiden är mellan kl 10 och 14, måndag till fredag
	const eventStartDate = new Date(eventStart);
	const eventEndDate = new Date(eventEnd);
	const dayOfWeek = eventStartDate.getDay();

	// JavaScript's getDay() returnerar 0 för söndag, 6 för lördag
	if (
		dayOfWeek === 0 ||
		dayOfWeek === 6 ||
		eventStartDate.getHours() < 10 ||
		eventEndDate.getHours() > 14
	) {
		return "Error: Event kan endast skapas mellan kl 10 och 14, måndag till fredag.";
	}

	// Steg 1.2 Hämta alla event som användaren har
	const getEvents = await fetch(
		`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${new Date().toISOString()}&timeZone=Europe/Stockholm`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);

	const events = await getEvents.json();
	const timeSlotAvailable = isTimeSlotAvailable(events.items, eventStart, eventEnd);

	if (!timeSlotAvailable) {
		return "Error: Tiden är upptagen.";
	}

	try {
		const response = await fetch(
			`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					summary: summary,
					description: description,
					start: {
						dateTime: eventStart,
						timeZone: "Europe/Stockholm",
					},
					end: {
						dateTime: eventEnd,
						timeZone: "Europe/Stockholm",
					},
				}),
			}
		);

		console.log({ response });

		if (!response.ok) {
			console.log(await response.text());
			throw new Error("Failed to create calendar event");
		}

		const data = await response.json();
		return `Event created: ${data.id}`;
	} catch (error) {
		console.error("Error creating calendar event:", error);
		return `Error: ${error.message}`;
	}
}

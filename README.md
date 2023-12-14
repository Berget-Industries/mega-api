[![Deno Test](https://github.com/willebergh/mega-api/actions/workflows/deno.yml/badge.svg?event=pull_request)](https://github.com/willebergh/mega-api/actions/workflows/deno.yml)

[![Docker Image](https://github.com/willebergh/mega-api/actions/workflows/deno.yml/badge.svg?event=push)](https://github.com/willebergh/mega-api/actions/workflows/deno.yml)

# API Dokumentation för MEGA API

#### Denna dokumentation är till användning för samtliga som använder vårat API för att lättare förstå hur den fungerar.

## AI Endpoints

### Endpoint `POST /api/ai/addMessageHistory`

Detta endpoint används för att lägga till meddelanden till en specifik konversation.

#### Request:

-   `conversation`: (`ObjectId`, obligatorisk) - Identifieraren för konversationen där meddelanden ska läggas till.
-   `contactEmail`: (`string`, obligatorisk) - E-postadressen för kontakten relaterad till meddelandet.
-   `contactName`: (`string`, obligatorisk) - Namnet på kontakten.
-   `createdAt`: (`Date`, obligatorisk) - Datum och tid när meddelandet skapades.
-   `input`: (`string`, obligatorisk) - Input-texten från användaren.
-   `llmOutput`: (`string`, obligatorisk) - Utsvaret från LLM.

#### Response:

-   `conversation`: (`object`) - Detaljerad information om den uppdaterade konversationen.

#### Felhantering:

-   Om konversationen inte hittas eller något annat fel uppstår, returneras ett felmeddelande.
-   För övriga interna fel returneras ett generellt tekniskt felmeddelande.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

### Endpoint `POST /api/ai/updateContact`

Detta endpoint används för att uppdatera eller skapa en ny kontakt i databasen.

#### Request:

-   `contact` (`object`, obligatorisk) - Ett objekt som innehåller kontaktinformation som ska uppdateras, inklusive `status`, `role`, `email`, `name`, `lastActivity`, `address`, `avatarUrl` och `phoneNumber`.

#### Response:

-   `status` (`string`) - Status för begäran.

#### Felhantering:

-   Om kontakten inte hittas eller något annat fel uppstår, returneras ett felmeddelande.
-   För övriga interna fel returneras ett generellt tekniskt felmeddelande.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

## Reservation Endpoints

### Endpoint `POST /api/ai/reservation/create`

Detta endpoint används för att skapa en ny reservation med tillhörande kund- och konversationsinformation.

#### Request:

-   `chambre` (`boolean`, obligatorisk) - Anger om bokningen är för en chambre.
-   `name` (`string`, obligatorisk) - Namnet på gästen.
-   `email` (`string`, obligatorisk) - E-postadresssen till gästen.
-   `date` (`string`, obligatorisk) - Datumet för reservationen.
-   `time` (`string`, obligatorisk) - Tiden för reservationen.
-   `numberOfGuests` (`number`, obligatorisk) - Antalet gäster.
-   `phone` (`string`, obligatorisk) - Telefonnummer till gästen.
-   `comment` (`string`, valfri) - Kommentar relaterad till reservationen.
-   `conversation` (`ObjectId`, valfri) - Identifierare för relaterad konversation.

#### Response:

-   `status` (`string`) - Status för begäran.
-   `message` (`string`) - Ett meddelande som beskriver utfallet.
-   `reservationData` (`object`) - Detaljerad information om den skapade reservationen.

#### Felhantering:

-   Om nödvändig information saknas eller är ogiltig, returneras ett lämpligt felmeddelande.
-   Bokningsregler kontrolleras för att säkerställa att de tiden, datumet och antalet gäster är följer reglerna.
-   Om bokningsreglerna inte följs returneras ett felmeddelande.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

### Endpoint `POST /api/ai/reservation/delete`

Denna används för att ta bort en specifik reservation.

#### Request:

-   `_id` (`ObjectId`, obligatorisk) - Identifieraren för den reservation som ska tas bort.

#### Response:

-   `status` (`string`) - Status för begäran.
-   `message` (`string`) - Ett meddelande som beskriver utfallet.
-   `reservationData` (`object`) - Information om den borttagna reservationen.

#### Felhantering:

-   Om `_id` saknas i förfrågan, returneras ett meddelande om att reservations-ID saknas.
-   Om reservationen inte kan hittas med det angivna ID:t, returneras ett meddelande om ogiltigt ID.
-   För övriga interna fel returneras ett generellt tekniskt felmeddelande.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

### Endpoint `POST /api/ai/reservation/edit`

Detta endpoint används för att uppdatera information om en specifik reservation.

#### Request:

-   `_id` (`ObjectId`, obligatorisk) - Identifieraren för den reservation som ska redigeras.
-   `name` (`string`, valfri) - Namnet på gästen.
-   `email` (`string`, valfri) - E-postadressen till gästen.
-   `date` (`string`, valfri) - Datumet för reservationen.
-   `time` (`string`, valfri) - Tiden för reservationen.
-   `numberOfGuests` (`number`, valfri) - Antalet gäster.
-   `phone` (`string`, valfri) - Telefonnummer till gästen.

#### Response:

-   `status` (`string`) - Status för begäran.
-   `message` (`string`) - Ett meddelande som beskriver utfallet eller information om tillgänglighet.
-   `reservationData` (`object`) - Detaljerad information om den uppdaterade reservationen.

#### Felhantering:

-   Om nödvändig information saknas eller är ogiltig, returneras ett lämpligt felmeddelande.
-   Bokningsregler kontrolleras för att säkerställa att de nya tiderna samt antalet gäster är korrekta.
-   Om bokningsreglerna inte följs eller om det önskade datumet och tiden inte är tillgängliga, returneras ett felmeddelande.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

### Endpoint `POST /api/ai/reservation/getAvailableChambreDates`

Detta endpoint används för att kontrollera tillgänglighet för chambre-bokningar mellan två datum.

#### Request

-   `startDate` (`string`, obligatorisk): Startdatumet för tidsintervallet som ska kontrolleras.
-   `endDate` (`string`, obligatorisk): Slutdatumet för tidsintervallet som ska kontrolleras.

#### Response:

-   `status` (`string`): Status för begäran.
-   `message` (`string`): Ett meddelande som beskriver utfallet eller information om tillgänglighet.

#### Felhantering:

-   Om nödvändig information som `startDate`eller `endDate` saknas, returneras ett meddelande om vilken information som saknas.
-   Om ett fel uppstår under processen att hämta tillgängliga datum, returneras ett felmeddelande.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

### Endpoint `POST /api/ai/reservation/getReservationData`

Detta endpoint används för att hämta information om en specifik reservation baserat på dess ID.

#### Request:

`_id` (`ObjectId`, obligatorisk): Identifieraren för den reservation som ska hämtas.

#### Response:

-   `status` (`string`): Status för begäran.
-   `message` (`string`): Ett meddelande som beskriver utfallet.
-   `reservationData` (`object`): Detaljerad information om den hämtade reservationen.

#### Felhantering:

-   Om `_id` saknas i förfrågan, returneras ett felmeddelande om att reservations-ID saknas.
-   Om reservationen inte kan hittas med det angivna ID:t, returneras ett felmeddelande om ogiltigt ID.
-   För övriga interna fel returneras ett generellt tekniskt felmeddelande.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

## Dashboard Endpoints

### Endpoint `GET /api/dashboard/conversation`

Detta endpoint används för att hämta detaljerad information om en enskild konversation.

#### Request:

-   `conversation` (`ObjectId`, obligatorisk): Identifieraren för den konversation som ska hämtas.

#### Response:

-   `conversationDoc` (`object`): Ett objekt som innehåller detaljer om den begärda konversationen, inklusive meddelanden och kontaktinformation.

#### Felhantering:

-   Om `conversation`-paramterern saknas, returneras ett felmeddelande som anger att reservations-ID saknas.
-   Om ett fel uppstår vid databasinteraktioner, som ett ogiltigt ID, hanteras detta och ett lämpligt felmeddelande returneras.
-   För övriga interna fel returneras ett generellt tekniskt felmeddelande.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

### Endpoint `GET /api/dashboard/conversations`

Detta endpoint används för att hämta alla konversationer som är kopplade till en specifik organisation.

#### Request:

-   `startDate` (`string`, obligatorisk): Startdatum för att filtrera meddelanden.
-   `endDate` (`string`, obligatorisk): Slutdatum för att filtrera meddelanden.
-   `organization` (`ObjectId`, obligatorisk): Identifieraren för den organisation som meddelandena tillhör.

#### Response:

-   `status`: (`string`): Status för begäran.
-   `message`: (`string`): Ett meddelande som beskriver utfallet.
-   `conversations` (`array`): En lista av konversationer som är kopplade till den angivna organisationen.

#### Felhantering:

-   Om `organization` saknas, returneras ett felmeddelande som anger att reservations-ID saknas.
-   Om ett fel uppstår vid databasinteraktioner, som ett ogiltigt ID, hanteras detta och ett lämpligt felmeddelande returneras.
-   För övriga interna fel returneras ett generellt tekniskt felmeddelande

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

### Endpoint `GET /api/dashboard/messages`

Detta endpoint används för att hämta meddelanden för en specifik organisation inom ett angivet datumintervall.

#### Request:

-   `startDate` (`string`, obligatorisk): Startdatum för att filtrera meddelanden.
-   `endDate` (`string`, obligatorisk): Slutdatum för att filtrera meddelanden.
-   `organization` (`ObjectId`, obligatorisk): Identifieraren för den organisation som meddelandena tillhör.

#### Response:

-   `status` (`string`): Status för begäran.
-   `message` (`string`): Ett meddelande som beskriver utfallet.
-   `messages` (`array`): En lista av meddelanden som hämtas från organisationen.

#### Felhantering;

-   Om obligatoriska parametrar saknas (t.ex. `organization`, `startDate`, `endDate`) returneras ett felmeddelande saknas.
-   Om ett fel uppstår vid databasinteraktioner, som ett ogiltigt ID, hanteras detta och ett lämpligt felmeddelande returneras.
-   För övriga interna fel returneras ett generellt tekniskt felmeddelande.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

## Icke Kategoriserade Endpoints

#### Endpoint `POST /api/addSelectedMenu`

Detta endpoint används för att lägga till eller uppdatera menyn för en specifik reservation.

#### Request:

-   `_id` (`ObjectId`, obligatorisk): Identifieraren för den reservation som ska uppdateras.
-   `menu` (`object`, obligatorisk): Ett objekt som innehåller menyn som ska läggas till i reservationen

#### Response:

-   `status` (`string`): Status för begäran.
-   `message` (`string`): Ett meddelande som beskriver utfallet.
-   `reservationData` (`object`): Det uppdaterade reservationsobjektet med de nya menydetaljerna.

#### Felhantering:

-   Om reservationen inte kan hittas med det angivna ID:t, returneras ett felmeddelande.
-   Om ett fel uppstår vid databasinteraktioner, som ett ogiltigt ID, hanteras detta och ett lämpligt felmeddelande returneras.
-   För övriga interna fel returneras ett generellt tekniskt felmeddelande.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

## Admin Endpoints

### Endpoints `POST /api/admin/createNewAiAccessKey`

Detta endpoint används för att generera en ny accessnyckel för AI för en given organisation

#### Request:

-   `organization` (`ObjectId`, obligatorisk): Identifieraren för den organisation som accessnyckeln ska skapas för.

#### Response:

-   `status` (`string`): Status för begäran.
-   `message` (`string`): Ett meddelande som beskriver utfallet eller information om tillgänglighet.
-   `aiAccessKey` (`object`): Detaljer om den genererade AI-accessnyckeln

#### Felhantering;

-   Om ett internt fel uppstår, returneras ett generellt felmeddelande om interna serverfel.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

### Endpoint `POST /api/admin/createNewOrganization`

Detta endpoint används för att skapa en ny organisation med tillhörande information.

#### Request:

-   `name` (`string`, obligatorisk): Namnet på organisationen.
-   `logoUrl` (`string`, valfri): URL till organisationens logotyp.
-   `users` (`array`, valfri): En lista av användar-ID:n som tillhör organisationen.

#### Response:

-   `status` (`string`): Status för begäran.
-   `message` (`string`): Ett meddelande som bekräftar skapandet av organisationen.
-   `organization` (`object`): Information om den nyss skapade organisationen.

#### Felhantering:

-   Om ett internt fel uppstår, returneras ett generellt felmeddelande om interna serverfel.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

### Endpoint `POST /api/admin/createNewUser`

Detta endpoint används för att skapa en ny användare med angivna attribut.

#### Request:

-   `name` (`string`, obligatorisk): Namnet på användaren.
-   `email` (`string`, obligatorisk): E-postadresssen till användaren.
-   `avatarUrl` (`string`, valfri): URL till användarens avatarbild.
-   `organizations` (`array`, valfri): En lista av organisationer som användaren tillhör.

#### Response:

-   `status` (`string`): Status för begäran.
-   `message` (`string`): Ett meddelande som bekräftar skapandet av organisationen.
-   `user` (`object`): Information om den nyss skapade användaren.

#### Felhantering:

-   Om användaren redan finns, returneras ett meddelande om att e-postadressen redan existerar.
-   Om ett internt fel uppstår, returneras ett generellt felmeddelande om interna serverfel.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

## Authentication Endpoints

### Endpoint `POST /api/auth/changePassword`

Detta endpoint används för att ändra en användares lösenord baserat på en giltig verifieringstoken.

#### Request:

-   `newPassword` (`string`, obligatorisk): Det nya lösenordet som användaren vill ställa in.
-   `token` (`string`, obligatorisk): En verifieringstoken som används för att validera lösenordsändringsbegäran.

#### Response:

-   `message` (`string`): Ett meddelande som bekräftar att lösenordet har ändrats framgångsrikt.

#### Felhantering:

-   Om token är ogiltig eller inte är av typen “reset-password”, returneras ett felmeddelande.
-   Om det uppstår ett fel under processen att ändra lösenordet, returneras ett felmeddelande om misslyckande.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

### Endpoint `POST /api/auth/login`

Detta endpoint används för att autentisera en användare och generera en JWT-accessnyckel för sessionen.

#### Request:

-   `email` (`string`, obligatorisk): E-postadressen till användaren.
-   `password` (`string`, obligatorisk): Användarens lösenord.

#### Response:

-   `accessToken` (`string`): En JWT-accessnyckel för den autentiserade sessionen.
-   `user` (`object`): Information om den autentiserade användaren.

#### Felhantering:

-   Om autentisering misslyckas (t.ex. fel lösenord eller användaren finns inte), returneras ett felmeddelande om obehörighet.
-   Om det uppstår ett internt fel under processen, returneras ett generellt felmeddelande om interna serverfel.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

### Endpoint `POST /api/auth/logout`

Detta endpoint används för att logga ut en användare genom att avsluta deras session.

#### Request:

-   Förfrågningar till detta endpoint bör innehålla en `Authorization`-header med en giltig JWT-accessnyckel.

#### Response:

-   `message` (`string`): Ett meddelande som bekräftar att användaren har loggat ut framgångsrikt.

#### Felhantering

-   Om det uppstår ett internt fel under processen, returneras ett generellt felmeddelande om interna serverfel.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

### Endpoint `POST /api/auth/me`

Detta endpoint används för att hämta information om den aktuellt autentiserade användaren.

#### Request:

-   Ingen specifik request body krävs för detta endpoint. Användaren måste vara autentiserad och ha en giltig session.

#### Response:

-   `user` (`object`): Information om den aktuellt autentiserade användaren.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

### Endpoint `POST /api/auth/resetPassword`

Detta endpoint används för att skicka ett e-postmeddelande för lösenordåterställning till en specificerad användare.

#### Request:

-   `email` (`string`, obligatorisk): E-postadressen till användaren som begär lösenordåterställning.

#### Response:

-   `message` (`string`): Ett meddelande som bekräftar att ett e-postmeddelande för lösenordsåterställning har skickats.

#### Felhantering:

-   Om användaren inte hittas (ogiltig e-postadress), returneras ett felmeddelande.
-   Om det uppstår ett fel under processen att skicka e-postmeddelandet, returneras ett felmeddelande om misslyckande.

#### Status koder:

-   `200(OK)` - Allting gick som det skulle.
-   `500(Internal-error)` - Det inträffade ett internt server fel.

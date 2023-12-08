import { AvailableDates } from "../models/index.ts";
import moment from "npm:moment";

const timesOfDay = {
	lunch: ["11:30", "16:00"],
	dinner: ["17:00", "21:00"],
};

const getKeyToUpdateByTime = (time: string) => {
	const keyToUpdate =
		time >= timesOfDay.lunch[0] && time <= timesOfDay.lunch[1]
			? "lunch"
			: time >= timesOfDay.dinner[0] && time <= timesOfDay.dinner[1]
			? "dinner"
			: "error";

	if (keyToUpdate === "error") {
		throw new Error("something is wrong with the times");
	}

	return keyToUpdate;
};

interface checkAvailableDatesInput {
	date: Date;
	time: string;
}
export async function checkAvailableDates({
	date,
	time,
}: checkAvailableDatesInput): Promise<boolean> {
	const startOfDay = moment(date).startOf("day");
	const endOfDay = moment(date).endOf("day");
	const dateToUpdate = await AvailableDates.findOne({
		date: {
			$gte: startOfDay,
			$lte: endOfDay,
		},
	});

	if (!dateToUpdate) {
		return false;
	}

	const keyToCheck = getKeyToUpdateByTime(time);

	if (dateToUpdate[keyToCheck].isAvailable) {
		return true;
	} else {
		return false;
	}
}

interface addReservationToDateInput {
	reservationId: string;
	date: Date;
	time: string;
}
export async function addReservationToDate({
	reservationId,
	date,
	time,
}: addReservationToDateInput) {
	const startOfDay = moment(date).startOf("day");
	const endOfDay = moment(date).endOf("day");
	const dateToUpdate = await AvailableDates.findOne({
		date: {
			$gte: startOfDay,
			$lte: endOfDay,
		},
	});

	if (!dateToUpdate) {
		throw new Error("Could not find date document");
	}

	const keyToUpdate = getKeyToUpdateByTime(time);

	await AvailableDates.updateOne(
		{
			date: {
				$gte: startOfDay,
				$lte: endOfDay,
			},
		},
		{
			$set: {
				[keyToUpdate]: {
					_id: reservationId,
					isAvailable: false,
				},
			},
		}
	);

	console.log(`Added reservation ${reservationId} to ${date} - ${keyToUpdate}`);
}

interface deleteReservationFromDateInput {
	reservationId: string;
}
export async function deleteReservationFromDate({ reservationId }: deleteReservationFromDateInput) {
	const dateDocumentToUpdate = await AvailableDates.findOne({
		$or: [{ "lunch._id": reservationId }, { "dinner._id": reservationId }],
	});

	if (!dateDocumentToUpdate) {
		throw new Error("Could not find date document. Could not delete reservation from date");
	}

	const keyToUpdate =
		reservationId === dateDocumentToUpdate.lunch._id
			? "lunch"
			: reservationId === dateDocumentToUpdate.dinner._id
			? "dinner"
			: "error";

	if (keyToUpdate === "error") {
		throw new Error("ReservationId is not in this date document");
	}

	dateDocumentToUpdate[keyToUpdate] = {
		isAvailable: true,
		_id: null,
	};

	await dateDocumentToUpdate.save();
	console.log(
		`Removed reservation ${reservationId} from ${dateDocumentToUpdate.date} - ${keyToUpdate}`
	);
}

interface editReservationFromDateInput {
	reservationId: string;
	date: Date;
	time: string;
}
export async function editReservationFromDate({
	reservationId,
	date,
	time,
}: editReservationFromDateInput) {
	const dateDocumentToUpdate = await AvailableDates.findOne({
		$or: [{ "lunch._id": reservationId }, { "dinner._id": reservationId }],
	});

	if (!dateDocumentToUpdate) {
		throw new Error("Could not find date document that should be updated!");
	}

	const isNewDateAvailable = await checkAvailableDates({ date, time });

	if (!isNewDateAvailable) {
		throw new Error("The new date is not available for booking!");
	}

	await deleteReservationFromDate({ reservationId });
	await addReservationToDate({ date, time, reservationId });
}

interface getAvailableChambreDatesInput {
	startDate: Date;
	endDate: Date;
}
export async function getAvilableDates({ startDate, endDate }: getAvailableChambreDatesInput) {
	const docs = await AvailableDates.find({
		date: {
			$gte: startDate,
			$lte: endDate,
		},
	});

	return docs;
}

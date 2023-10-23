import { AvailableDate } from "../models/AvailableDatesModel.ts";

export async function checkAvailableDates(date: Date, time: string, _id: string) {
	const searchId = _id;
	const searchDate = date;
	const dateFilter = { date: searchDate };
	const document = await AvailableDate.findOne(dateFilter);

	if (document) {
		if (time >= "11:30" && time <= "16:00") {
			if (document.lunch.isAvailable === true) {
				return "Kan bokas";
			} else if (document.lunch.isAvailable === false || document.lunch.isAvailable !== "") {
				return "Kan inte bokas";
			}
		} else if (time >= "17:00" && time < "21:00") {
			if (document.dinner.isAvailable === true) {
				return "Kan bokas";
			} else if (
				document.dinner.isAvailable === false ||
				document.dinner.isAvailable !== ""
			) {
				return "Kan inte bokas";
			}
		}
	}
}

export async function addReservationToDate(date: string, time: string, addToDate: any) {
	const searchDate = date;
	const dateFilter = { date: searchDate };
	const document = await AvailableDate.findOne(dateFilter);
	const updateDate = {
		_id: document?._id,
	};

	if (time >= "11:30" && time <= "16:00") {
		const update = {
			$set: {
				lunch: {
					...addToDate,
					isAvailable: false,
				},
			},
		};
		await AvailableDate.updateOne(updateDate, update);
	} else if (time >= "17:00" && time < "21:00") {
		const update = {
			$set: {
				dinner: {
					...addToDate,
					isAvailable: false,
				},
			},
		};
		await AvailableDate.updateOne(updateDate, update);
	}
}

export async function deleteReservationFromDate(_id: string) {
	const searchId = _id;
	const objFilter = {
		$or: [{ "lunch._id": searchId }, { "dinner._id": searchId }],
	};
	const document = await AvailableDate.findOne(objFilter);
	if (document) {
		const updateFilter = {
			_id: document._id,
		};
		if (searchId === document?.lunch._id) {
			const update = {
				$set: {
					lunch: {
						isAvailable: true,
					},
				},
			};
			await AvailableDate.updateOne(updateFilter, update);
		} else if (searchId === document?.dinner._id) {
			const update = {
				$set: {
					dinner: {
						isAvailable: true,
					},
				},
			};
			await AvailableDate.updateOne(updateFilter, update);
		}
	}
}

export async function editReservationFromDate(_id: string, time: string, date: Date) {
	const searchId = _id;
	const objFilter = {
		$or: [{ "lunch._id": searchId }, { "dinner._id": searchId }],
	};

	const document = await AvailableDate.findOne(objFilter);
	if (document) {
		let reservationToMove;
		if (document.lunch._id === searchId) {
			(reservationToMove = document.lunch), document.lunch.isAvailable;
		} else if (document.dinner._id === searchId) {
			(reservationToMove = document.dinner), document.dinner.isAvailable;
		}
		if (document.lunch._id === searchId) {
			document.lunch = {
				isAvailable: true,
			};
		} else if (document.dinner._id === searchId) {
			document.dinner = {
				isAvailable: true,
			};
		}

		const newReservationDate = await AvailableDate.findOne({ date: date });
		if (newReservationDate) {
			if (time >= "11:30" && time <= "16:00") {
				newReservationDate.lunch = reservationToMove;
			} else if (time >= "17:00" && time < "21:00") {
				newReservationDate.dinner = reservationToMove;
			}
			await newReservationDate.save();
			await document.save();
		}
	}
}

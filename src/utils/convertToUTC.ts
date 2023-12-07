export default function convertToUTC(date: Date, time: string) {
	const combinedDate = new Date(`${date}T${time}`);
	const utcDateTime = new Date(combinedDate.getTime() - combinedDate.getTimezoneOffset() * 60000);
	return utcDateTime;
}

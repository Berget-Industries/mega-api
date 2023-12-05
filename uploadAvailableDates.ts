const data = [
	{
		date: "2023-01-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-01-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-01-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-01-04",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-01-05",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-01-06",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-01-07",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-01-08",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-01-09",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-01-10",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-01-11",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-01-12",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-01-13",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-01-14",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-01-15",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-01-16",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-01-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-01-18",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-01-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-01-20",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-01-21",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-01-22",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-01-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-01-24",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-01-25",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-01-26",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-01-27",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-01-28",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-01-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-01-30",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-01-31",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-02-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-02-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-02-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-02-04",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-02-05",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-02-06",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-02-07",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-02-08",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-02-09",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-02-10",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-02-11",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-02-12",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-02-13",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-02-14",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-02-15",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-02-16",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-02-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-02-18",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-02-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-02-20",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-02-21",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-02-22",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-02-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-02-24",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-02-25",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-02-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-02-27",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-02-28",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-03-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-03-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-03-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-03-04",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-03-05",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-03-06",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-03-07",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-03-08",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-03-09",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-03-10",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-03-11",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-03-12",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-03-13",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-03-14",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-03-15",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-03-16",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-03-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-03-18",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-03-19",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-03-20",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-03-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-03-22",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-03-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-03-24",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-03-25",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-03-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-03-27",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-03-28",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-03-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-03-30",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-03-31",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-04-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-04-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-04-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-04-04",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-04-05",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-04-06",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-04-07",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-04-08",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-04-09",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-04-10",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-04-11",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-04-12",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-04-13",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-04-14",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-04-15",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-04-16",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-04-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-04-18",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-04-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-04-20",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-04-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-04-22",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-04-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-04-24",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-04-25",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-04-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-04-27",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-04-28",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-04-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-04-30",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-05-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-05-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-05-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-05-04",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-05-05",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-05-06",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-05-07",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-05-08",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-05-09",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-05-10",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-05-11",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-05-12",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-05-13",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-05-14",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-05-15",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-05-16",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-05-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-05-18",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-05-19",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-05-20",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-05-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-05-22",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-05-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-05-24",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-05-25",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-05-26",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-05-27",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-05-28",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-05-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-05-30",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-05-31",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-06-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-06-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-06-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-06-04",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-06-05",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-06-06",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-06-07",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-06-08",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-06-09",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-06-10",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-06-11",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-06-12",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-06-13",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-06-14",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-06-15",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-06-16",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-06-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-06-18",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-06-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-06-20",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-06-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-06-22",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-06-23",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-06-24",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-06-25",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-06-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-06-27",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-06-28",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-06-29",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-06-30",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-07-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-07-04",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-05",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-06",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-07",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-07-08",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-09",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-07-10",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-07-11",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-12",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-07-13",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-14",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-15",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-07-16",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-17",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-18",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-20",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-07-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-22",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-07-24",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-25",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-27",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-28",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-07-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-07-30",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-07-31",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-08-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-08-04",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-05",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-06",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-08-07",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-08",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-09",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-08-10",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-08-11",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-12",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-13",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-08-14",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-15",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-16",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-17",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-08-18",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-08-20",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-22",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-08-24",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-08-25",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-08-27",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-28",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-08-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-30",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-08-31",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-09-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-09-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-09-03",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-09-04",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-09-05",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-09-06",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-09-07",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-09-08",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-09-09",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-09-10",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-09-11",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-09-12",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-09-13",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-09-14",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-09-15",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-09-16",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-09-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-09-18",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-09-19",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-09-20",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-09-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-09-22",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-09-23",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-09-24",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-09-25",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-09-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-09-27",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-09-28",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-09-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-09-30",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-10-04",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-05",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-10-06",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-10-07",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-08",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-09",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-10-10",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-11",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-10-12",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-10-13",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-10-14",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-15",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-10-16",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-18",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-10-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-20",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-10-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-22",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-10-23",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-24",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-25",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-10-26",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-27",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-10-28",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-10-30",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-10-31",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-02",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-03",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-11-04",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-11-05",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-06",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-11-07",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-08",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-09",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-11-10",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-11-11",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-12",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-11-13",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-14",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-15",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-11-16",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-17",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-11-18",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-11-20",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-22",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-11-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-24",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-11-25",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-11-27",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-11-28",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-11-30",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-12-02",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-03",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-04",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-05",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-12-06",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-12-07",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-08",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-12-09",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-10",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-12-11",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-12",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-13",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-14",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-12-15",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-16",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-12-18",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-12-20",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-22",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-12-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-12-24",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-25",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-12-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-27",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-12-28",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-29",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2023-12-30",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2023-12-31",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-01-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-01-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-01-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-01-04",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-01-05",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-01-06",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-01-07",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-01-08",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-01-09",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-01-10",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-01-11",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-01-12",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-01-13",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-01-14",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-01-15",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-01-16",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-01-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-01-18",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-01-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-01-20",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-01-21",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-01-22",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-01-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-01-24",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-01-25",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-01-26",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-01-27",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-01-28",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-01-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-01-30",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-01-31",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-02-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-02-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-02-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-02-04",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-02-05",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-02-06",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-02-07",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-02-08",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-02-09",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-02-10",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-02-11",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-02-12",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-02-13",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-02-14",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-02-15",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-02-16",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-02-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-02-18",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-02-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-02-20",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-02-21",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-02-22",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-02-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-02-24",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-02-25",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-02-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-02-27",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-02-28",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-03-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-03-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-03-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-03-04",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-03-05",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-03-06",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-03-07",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-03-08",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-03-09",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-03-10",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-03-11",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-03-12",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-03-13",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-03-14",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-03-15",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-03-16",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-03-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-03-18",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-03-19",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-03-20",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-03-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-03-22",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-03-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-03-24",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-03-25",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-03-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-03-27",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-03-28",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-03-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-03-30",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-03-31",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-04-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-04-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-04-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-04-04",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-04-05",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-04-06",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-04-07",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-04-08",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-04-09",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-04-10",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-04-11",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-04-12",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-04-13",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-04-14",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-04-15",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-04-16",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-04-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-04-18",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-04-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-04-20",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-04-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-04-22",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-04-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-04-24",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-04-25",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-04-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-04-27",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-04-28",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-04-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-04-30",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-05-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-05-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-05-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-05-04",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-05-05",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-05-06",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-05-07",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-05-08",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-05-09",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-05-10",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-05-11",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-05-12",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-05-13",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-05-14",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-05-15",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-05-16",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-05-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-05-18",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-05-19",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-05-20",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-05-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-05-22",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-05-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-05-24",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-05-25",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-05-26",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-05-27",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-05-28",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-05-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-05-30",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-05-31",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-06-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-06-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-06-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-06-04",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-06-05",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-06-06",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-06-07",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-06-08",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-06-09",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-06-10",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-06-11",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-06-12",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-06-13",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-06-14",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-06-15",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-06-16",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-06-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-06-18",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-06-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-06-20",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-06-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-06-22",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-06-23",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-06-24",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-06-25",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-06-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-06-27",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-06-28",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-06-29",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-06-30",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-07-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-07-04",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-05",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-06",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-07",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-07-08",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-09",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-07-10",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-07-11",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-12",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-07-13",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-14",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-15",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-07-16",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-17",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-18",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-20",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-07-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-22",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-07-24",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-25",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-27",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-28",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-07-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-07-30",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-07-31",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-08-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-08-04",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-05",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-06",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-08-07",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-08",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-09",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-08-10",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-08-11",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-12",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-13",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-08-14",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-15",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-16",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-17",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-08-18",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-08-20",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-22",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-08-24",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-08-25",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-08-27",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-28",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-08-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-30",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-08-31",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-09-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-09-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-09-03",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-09-04",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-09-05",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-09-06",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-09-07",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-09-08",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-09-09",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-09-10",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-09-11",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-09-12",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-09-13",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-09-14",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-09-15",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-09-16",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-09-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-09-18",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-09-19",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-09-20",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-09-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-09-22",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-09-23",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-09-24",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-09-25",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-09-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-09-27",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-09-28",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-09-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-09-30",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-02",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-03",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-10-04",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-05",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-10-06",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-10-07",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-08",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-09",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-10-10",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-11",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-10-12",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-10-13",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-10-14",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-15",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-10-16",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-18",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-10-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-20",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-10-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-22",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-10-23",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-24",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-25",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-10-26",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-27",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-10-28",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-10-30",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-10-31",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-02",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-03",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-11-04",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-11-05",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-06",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-11-07",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-08",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-09",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-11-10",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-11-11",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-12",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-11-13",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-14",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-15",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-11-16",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-17",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-11-18",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-11-20",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-22",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-11-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-24",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-11-25",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-11-27",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-11-28",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-29",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-11-30",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-01",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-12-02",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-03",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-04",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-05",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-12-06",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-12-07",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-08",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-12-09",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-10",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-12-11",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-12",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-13",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-14",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-12-15",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-16",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-17",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-12-18",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-19",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-12-20",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-21",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-22",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-12-23",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-12-24",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-25",
		lunch: { isAvailable: true },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-12-26",
		lunch: { isAvailable: false },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-27",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-12-28",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-29",
		lunch: { isAvailable: false },
		dinner: { isAvailable: false },
	},
	{
		date: "2024-12-30",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
	{
		date: "2024-12-31",
		lunch: { isAvailable: true },
		dinner: { isAvailable: true },
	},
];

import AvailableDate from "./src/models/AvailableDates.ts";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

try {
	const uri = Deno.env.get("MONGOOSE_CONNECT_URI");

	if (!uri) {
		console.log("Could not find MONGOOSE_CONNECT_URI env.");
		Deno.exit();
	}

	console.log("Connecting to database...");
	await mongoose.connect(uri);
	console.log("Connected to database successfully.");

	for (const dateToAdd of data) {
		const parsedData = {
			...dateToAdd,
			date: new Date(dateToAdd.date),
		};
		const newDoc = await AvailableDate.create(parsedData);
		console.log("Added document", newDoc);
	}

	console.log("All documents upploaded!");
} catch (error) {
	console.error(error);
	Deno.exit();
}

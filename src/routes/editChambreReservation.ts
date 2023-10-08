import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ChambreReservation } from "../models/ReservationChambreModel.ts";
import rulesFile from "../../config.json" with {type: "json"};
const router = new Router();

async function editChambreReservation(ctx: Context) {
  try {
    const {_id, name, email, date, time, numberOfGuests} = await ctx.request.body().value;
    const input = {
      _id,
      name,
      email,
      date,
      time,
      numberOfGuests,
    };

    const updateData: Record<string, any> = {};
    for (const [key, value] of Object.entries(input)) {
      if (value !== null && value !== "") {
        updateData[key] = value
      }
    }

    const rulesPassed = checkBookingRules(input, ctx);
    if (!rulesPassed) {
      return;
    }
  
    const reservationDetails = await ChambreReservation.findOneAndUpdate({ _id }, { $set: updateData }, { new: true });

    if (!reservationDetails) {
      return ctx.response.status = 404, ctx.response.body = "Tjatja"
    }

    const response = {
      status: "success",
      message: "Reservationen har uppdaterats!",
      reservationData: reservationDetails
    }

    console.log(response)
    ctx.response.status = 201;
    ctx.response.body = response
  } catch (error) {
    const errRes = {
      status: "internal-error",
      message: "Kunde inte ändra reservationen."
    }
    console.log(errRes)
    ctx.response.status = 500
    ctx.response.body = errRes
    console.log("Fel inträffade: ", error)
  }
}

function checkBookingRules(input: any, ctx: any) {
  const rules = rulesFile.rules.chambreBookingRules
  const numberOfGuests = input.numberOfGuests
  let rulesPassed = true;
  const noSuccess = {
    status: "Failed to continue",
    message: "Antingen för många personer eller för lite."
  }

  rules.forEach(({ max, min }: { max: number; min: number }) => {
    if (numberOfGuests > max || numberOfGuests < min) {
      rulesPassed = false;
    }
  });
  
  if (!rulesPassed) {
    ctx.response.status = 406
    ctx.response.body = noSuccess
  } else {
    return true;
  }
}

router.post("/editChambreReservation", editChambreReservation)

export default router;

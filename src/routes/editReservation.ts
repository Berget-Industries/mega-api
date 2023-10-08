import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Reservation } from "../models/ReservationModel.ts";
const router = new Router();

async function editReservation(ctx: Context) {
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
  
    const reservationDetails = await Reservation.findOneAndUpdate({ _id }, { $set: updateData }, { new: true });

    if (!reservationDetails) {
      return ctx.response.status = 404, ctx.response.body = "Tjatja", console.log("tjatja")
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

router.post("/editReservation", editReservation)

export default router;

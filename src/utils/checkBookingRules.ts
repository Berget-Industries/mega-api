import rulesFile from "../../config.json" with {type: "json"};

export default function checkBookingRules(input: any, ctx: any) {
    const rules = rulesFile.rules.chambreBookingRules
    const numberOfGuests = input.numberOfGuests
    const time = input.time
    let rulesPassed = true;
    const noSuccess = {
      status: "Failed to continue",
      message: "Antingen för många personer eller för lite."
    }
    const beforeOrAfterOpen = {
      status: "Failed to continue",
      message: "Man kan endast boka La Cucina mellan 11:30 - 21:00"
    }
  
    rules.forEach(({ max, min, opening, closing}: { max: number; min: number; opening: string; closing: string; }) => {
      if (numberOfGuests > max || numberOfGuests < min) {
        rulesPassed = false;
        ctx.response.status = 500
        ctx.response.body = noSuccess
      } else if (time < opening || time >= closing) {
        rulesPassed = false
        ctx.response.status = 500
        ctx.response.body = beforeOrAfterOpen
      } else {
        return true
      }
    });

    if(!rulesPassed) {
      return false;
    } else {
      return true;
    }
  }
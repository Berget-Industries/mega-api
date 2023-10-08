import rulesFile from "../../config.json" with {type: "json"};

export default function checkBookingRules(input: any, ctx: any) {
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
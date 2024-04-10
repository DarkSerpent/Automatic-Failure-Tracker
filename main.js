Hooks.on("createChatMessage", (message, options, userId) => {
  if (message.isRoll && message.roll) {
    const roll = message.roll;
    console.log("Roll Content:", message.content); // Logging roll content for debugging
    if (roll.formula.includes("2d6") && roll.terms) {
      const diceResults = roll.terms.flatMap(term => term.results || []).filter(result => result !== undefined);
      console.log("Dice Results:", diceResults);
      if (diceResults.length === 2 && diceResults.every(result => result.result === 1)) {
        const playerName = game.users.get(userId).name;
        ChatMessage.create({
          content: `<div style="background-color: #FFC0CB; padding: 5px; border-radius: 5px;">
                      <span style="font-weight: bold; color: #189AB4;">${playerName}</span> has rolled an <span style="font-weight: bold; color: #8B0000;">Automatic Failure!</span> Please check one of your Automatic Failure boxes on your sheet, if possible.
                    </div>`,
          type: CONST.CHAT_MESSAGE_TYPES.OTHER
        });
      }
    }
  }
});

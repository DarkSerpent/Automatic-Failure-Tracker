Hooks.on('init', function() {
  game.settings.register('automatic-failure-tracker', 'enableAutoFailTracker', {
    name: 'Enable Automatic Failure Tracker',
    hint: 'Check to enable the Automatic Failure Tracker. If this setting is disabled, the checkbox in the Chat Messages tab will do nothing.',
    scope: 'client',
    config: true,
    type: Boolean,
    default: true,
    onChange: value => {
      console.log(value ? 'Automatic Failure Tracker Enabled' : 'Automatic Failure Tracker Disabled');
    }
  });
});

Hooks.on("createChatMessage", (message, options, userId) => {
  if (!game.settings.get('automatic-failure-tracker', 'enableAutoFailTracker')) {
    return;
  }
  if (message.isRoll && message.roll) {
    const roll = message.roll;
    console.log("Roll Content:", message.content);
    if (roll.formula.includes("2d6") && roll.terms) {
      const diceResults = roll.terms.flatMap(term => term.results || []).filter(result => result !== undefined);
      console.log("Dice Results:", diceResults);
      if (diceResults.length === 2 && diceResults.every(result => result.result === 1)) {
        let playerName = '';
        if (!game.user.isGM) {
          const actor = game.users.get(userId).character;
          if (actor) {
            playerName = actor.name;
          } else {
            playerName = game.users.get(userId).name;
          }
        } else {
          const tokens = canvas.tokens.controlled;
          if (tokens.length > 0) {
            playerName = tokens[0].name;
          } else {
            playerName = game.users.get(userId).name;
          }
        }
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

Hooks.on('renderChatLog', (app, html, data) => {
  const enableAutoFailTracker = game.settings.get('automatic-failure-tracker', 'enableAutoFailTracker');
  if (enableAutoFailTracker === undefined) {
    game.settings.set('automatic-failure-tracker', 'enableAutoFailTracker', true);
  }

  const checkbox = $(`<input type="checkbox" name="enableAutoFailTracker" ${enableAutoFailTracker ? 'checked' : ''}>`);
  const label = $(`<label style="display: flex; align-items: center;">Enable Automatic Failure Tracker</label>`);
  label.prepend(checkbox);

  const div = $('<div id="chat-controls" class="flexrow" style="white-space: nowrap; margin-bottom: 5px;"></div>');
  div.append(label);
  html.find('.chat-control-icon').parent().after(div);

  checkbox.change(function() {
    game.settings.set('automatic-failure-tracker', 'enableAutoFailTracker', this.checked);
  });
});




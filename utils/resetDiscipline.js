const User = require("../models/User.model");

function isYesterday(date) {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

async function resetAllUsersDisciplines() {
  try {
    const users = await User.find({});

    for (const user of users) {
      let updated = false;

      user.disciplines.forEach((discipline) => {
        if (discipline.completed) {
          if (
            discipline.lastCompletedAt &&
            isYesterday(discipline.lastCompletedAt)
          ) {
            discipline.streak += 1;
          } else {
            discipline.streak = 1;
          }
        } else {
          // if not completed, reset streak
          const last = discipline.lastCompletedAt;
          if (!last || !isYesterday(last)) {
            discipline.streak = 0;
          }
        }

        discipline.completed = false;
        updated = true;
      });
      if (updated) {
        await user.save();
      }
    }

    console.log("All user's disciplines resetted for the day");
  } catch (error) {
    console.log("Error on cron job");
    console.log(error);
  }
}

module.exports = resetAllUsersDisciplines;

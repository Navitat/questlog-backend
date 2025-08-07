const cron = require("node-cron");
const resetAllUsersDisciplines = require("../utils/resetDiscipline");

function startDailyResetJob() {
  // Runs every day at 00:00
  cron.schedule("0 0 * * *", async () => {
    try {
      await resetAllUsersDisciplines();
    } catch (err) {
      console.error("Error running daily reset:", err);
    }
  });

  console.log("✅ Daily reset cron job scheduled (runs at 00:00).");
}

module.exports = startDailyResetJob;

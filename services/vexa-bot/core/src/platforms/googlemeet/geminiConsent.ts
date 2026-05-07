import { Page } from "playwright";
import { log } from "../../utils";

const GEMINI_TRANSCRIPTION_DIALOG_TEXT = /This video call is being transcribed|Gemini is taking notes/i;

export async function clickGoogleMeetGeminiConsentJoinNow(
  page: Page,
  timeoutMs = 1500
): Promise<boolean> {
  const dialog = page
    .locator('[role="dialog"], [role="alertdialog"]')
    .filter({ hasText: GEMINI_TRANSCRIPTION_DIALOG_TEXT })
    .first();

  const visible = await dialog.isVisible({ timeout: timeoutMs }).catch(() => false);
  if (!visible) {
    return false;
  }

  const joinNowButton = dialog.getByRole("button", { name: /^Join now$/i }).first();
  const buttonVisible = await joinNowButton.isVisible({ timeout: timeoutMs }).catch(() => false);
  if (!buttonVisible) {
    log("Google Meet Gemini transcription dialog detected, but Join now button was not visible.");
    return false;
  }

  await joinNowButton.click();
  log('Clicked Google Meet Gemini transcription consent "Join now" button.');
  return true;
}

export async function waitAndClickGoogleMeetGeminiConsentJoinNow(
  page: Page,
  timeoutMs = 8000,
  pollIntervalMs = 500
): Promise<boolean> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (await clickGoogleMeetGeminiConsentJoinNow(page, pollIntervalMs)) {
      return true;
    }

    await page.waitForTimeout(pollIntervalMs);
  }

  return false;
}

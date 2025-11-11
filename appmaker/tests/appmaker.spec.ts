import { test, expect } from "@playwright/test";

test.describe("AppMaker happy path (stub mode)", () => {
  test("sends idea, receives stubbed response, and triggers Cursor export stub", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByText("AppMaker · Vibecoding lab")).toBeVisible();

    const textarea = page.getByLabel("Drop your idea or follow-up");
    await textarea.fill("I want a mood-driven journaling companion that adapts to my playlists.");
    await page.getByRole("button", { name: "Send to AppMaker" }).click();

    await expect(
      page.getByText("Here’s a quick pass based on the stub generator.", { exact: false }),
    ).toBeVisible();

    const clarificationBadge = page
      .getByText("Clarifications")
      .locator("..")
      .locator("span", { hasText: /\d+/ });
    await expect(clarificationBadge).toBeVisible();

    await page.getByRole("button", { name: "Export to Cursor" }).click();

    await expect(
      page.getByText("Cursor credentials are not configured.", {
        exact: false,
      }),
    ).toBeVisible();
  });
});

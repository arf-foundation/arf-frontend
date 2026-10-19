import { test, expect, visit } from "./fixtures";

test.describe("Compliance Dashboard PDF Export", () => {
  test("navigates to Compliance tab, generates report, and downloads valid PDF", async ({
    page,
    problems,
  }) => {
    // 1. Visit dashboard and wait for hydration/data to settle
    await visit(page, "/dashboard");

    // Wait until simulation data is rendered (loading state clears)
    await expect(page.getByText("Loading simulation...")).not.toBeVisible({
      timeout: 10_000,
    });

    // 2. Select the Compliance tab (support both desktop tablist and mobile bottom nav)
    const complianceTab = page.locator(
      "#tab-compliance:visible, #tab-mobile-compliance:visible"
    );
    await expect(complianceTab).toBeVisible();
    await complianceTab.click();

    // Verify compliance tab is selected and panel is active
    await expect(complianceTab).toHaveAttribute("aria-selected", "true");
    const compliancePanel = page.locator("#tabpanel-compliance");
    await expect(compliancePanel).toBeVisible();

    // 3. Click "Generate report" button to open PrintableReportModal
    const generateBtn = page.getByRole("button", { name: /generate report/i });
    await expect(generateBtn).toBeVisible();
    await generateBtn.click();

    // Verify modal is open and displays compliance report heading
    const modalHeading = page.getByRole("heading", {
      name: "ARF Governance Compliance Report",
    });
    await expect(modalHeading).toBeVisible();

    // 4. Click "Download PDF" and intercept both the API response and the browser download
    const responsePromise = page.waitForResponse(
      (res) =>
        res.url().includes("/api/report") &&
        res.request().method() === "POST",
      { timeout: 30_000 }
    );
    const downloadPromise = page.waitForEvent("download", { timeout: 30_000 });

    const downloadBtn = page.getByRole("button", { name: /download pdf/i });
    await expect(downloadBtn).toBeVisible();
    await downloadBtn.click();

    // 5. Verify the HTTP response from /api/report
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("application/pdf");
    expect(response.headers()["content-disposition"]).toContain("attachment");

    // 6. Verify the download file and its binary PDF header
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("arf-compliance-report.pdf");

    const stream = await download.createReadStream();
    if (!stream) {
      throw new Error("Failed to open download stream");
    }

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    // Verify non-empty and starts with standard PDF magic bytes '%PDF-'
    expect(pdfBuffer.length).toBeGreaterThan(1000);
    expect(pdfBuffer.subarray(0, 5).toString("ascii")).toBe("%PDF-");

    // 7. Verify no client errors, uncaught exceptions, or failed requests
    problems.expectNone();
  });
});

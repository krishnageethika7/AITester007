### Test Plan for JIRA ID: SCRUM-5
#### Objective
The objective of this test plan is to ensure that the new Transactions page meets the requirements outlined in JIRA ID: SCRUM-5, providing a centralized view for users to track orders and their lifecycle states.

#### Scope
The scope of this test plan includes:
- Verifying the Transactions page displays a paginated table of all order records with required fields.
- Testing filtering, sorting, and searching functionality.
- Validating data export to CSV and responsive layout.
- Ensuring the page loads within the specified time frame for a large number of records.

#### Out-of-Scope
The following items are out of scope for this test plan:
- Order creation or editing from the Transactions page.
- Real-time streaming updates.
- Historical audit trail/version history of field changes.

#### Test Cases

##### Positive Test Cases
1. **ID:** POS-1, **Type:** Positive, **Title:** Default Page Load
   - **Preconditions:** User is logged in and has access to the Transactions page.
   - **Steps:**
     1. Navigate to the Transactions page.
     2. Verify the page loads within 2 seconds.
     3. Confirm the default pagination displays 25 rows.
     4. Check each row displays: Order ID, Trade Date, Settlement Date, Security, Order Type, Quantity, Price, Gross Amount, Currency, Status.
   - **Expected Result:** The page loads quickly, displays the required fields for each order record, and is paginated correctly.

2. **ID:** POS-2, **Type:** Positive, **Title:** Filtering by Date Range
   - **Preconditions:** User is on the Transactions page with multiple order records.
   - **Steps:**
     1. Apply a date range filter for Trade Date.
     2. Verify the results are filtered accordingly.
     3. Repeat for Settlement Date.
   - **Expected Result:** The order records are correctly filtered by the specified date ranges.

3. **ID:** POS-3, **Type:** Positive, **Title:** Sorting by Column Header
   - **Preconditions:** User is on the Transactions page with multiple order records.
   - **Steps:**
     1. Click on a column header to sort in ascending order.
     2. Verify the records are sorted correctly.
     3. Click the same header to toggle to descending order.
     4. Verify the records are sorted in descending order.
   - **Expected Result:** The order records are sorted correctly in both ascending and descending orders.

##### Negative Test Cases
1. **ID:** NEG-1, **Type:** Negative, **Title:** Invalid Filter Input
   - **Preconditions:** User is on the Transactions page.
   - **Steps:**
     1. Enter an invalid date range (e.g., future date in the "from" field).
     2. Attempt to apply the filter.
   - **Expected Result:** The system prevents the application of the invalid filter and possibly displays an error message.

2. **ID:** NEG-2, **Type:** Negative, **Title:** No Records Match Filters
   - **Preconditions:** User is on the Transactions page with filters applied that yield no results.
   - **Steps:**
     1. Verify an empty state is displayed.
     2. Check for a clear call-to-action (CTA) to reset filters.
   - **Expected Result:** The empty state is correctly displayed with a clear CTA to reset filters.

##### Edge Cases
1. **ID:** EDGE-1, **Type:** Edge Case, **Title:** Large Dataset
   - **Preconditions:** The system has more than 10,000 order records.
   - **Steps:**
     1. Navigate to the Transactions page.
     2. Verify server-side pagination is used beyond 10,000 records.
   - **Expected Result:** The page loads efficiently, using server-side pagination for large datasets.

2. **ID:** EDGE-2, **Type:** Edge Case, **Title:** Responsive Layout
   - **Preconditions:** User accesses the Transactions page on a tablet viewport (≥ 768 px).
   - **Steps:**
     1. Verify the layout is responsive and usable.
     2. Test filtering, sorting, and searching on the tablet viewport.
   - **Expected Result:** The Transactions page is usable on the tablet viewport, with all functionality working as expected.

##### API-Level Test Cases
1. **ID:** API-1, **Type:** API-Level, **Title:** Data Retrieval
   - **Preconditions:** API endpoint for retrieving order records is available.
   - **Steps:**
     1. Send a request to the API endpoint to retrieve order records.
     2. Verify the response includes all required fields for each order record.
   - **Expected Result:** The API returns the order records with all required fields.

2. **ID:** API-2, **Type:** API-Level, **Title:** Filtering and Sorting via API
   - **Preconditions:** API endpoint supports filtering and sorting parameters.
   - **Steps:**
     1. Send a request to the API endpoint with filtering parameters (e.g., date range).
     2. Verify the response is filtered accordingly.
     3. Send a request with sorting parameters.
     4. Verify the response is sorted correctly.
   - **Expected Result:** The API returns filtered and sorted results as specified in the request.

#### Risks
- **Missing Requirements:** The acceptance criteria in the JIRA ticket are not specified, which could lead to misunderstandings about what constitutes a "pass" for the new Transactions page.
- **Performance:** The requirement for the page to load within 2 seconds for up to 10,000 records is ambitious and may pose technical challenges.
- **Data Volume:** Testing with a large dataset (over 10,000 records) may require significant resources and could impact test environment performance.
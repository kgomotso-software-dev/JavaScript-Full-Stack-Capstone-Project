---
name: User Story
about: Create a user story issue
title: "[USER STORY] "
labels: backlog
assignees: ''
---

## User Story

**As a** user  
**I need** to browse and search gifts  
**So that** I can find suitable gifts quickly

## Details and Assumptions

* Users can register and log in
* Gifts are stored in MongoDB
* API provides search and filter functionality

## Acceptance Criteria

```gherkin
Given the user is on the gifts page
When the user views the available gifts
Then all gifts should be displayed

Given the user enters a category in search
When the search is executed
Then only matching gifts should be returned

Given the user selects a gift
When the gift details page opens
Then complete gift information should be displayed

---
name: agent-browser
description: Browser automation for web testing, form filling, screenshots, and data extraction. Use when the user needs to navigate websites, interact with web pages, fill in forms, take screenshots, test web applications, or extract information from web pages.
---

# Browser automation with agent-browser

`agent-browser` is a global CLI, not a workspace dependency: call it directly, once it is installed on the machine (for example with mise, `npm:agent-browser`).

## Quick start

```bash
agent-browser open <url>        # Navigate to a page
agent-browser snapshot -i       # Get interactive elements with refs
agent-browser click @e1         # Click an element by ref
agent-browser fill @e2 "text"   # Fill an input by ref
agent-browser close             # Close the browser
```

## Basic workflow

1. **Navigate**: `agent-browser open <url>`
2. **Snapshot**: `agent-browser snapshot -i` (returns refs like `@e1`, `@e2`)
3. **Interact using the refs from the snapshot**
4. **Re-snapshot after navigation or significant DOM changes**

## Commands

### Navigation

```bash
agent-browser open <url>      # Navigate to a URL
agent-browser back            # Go back
agent-browser forward         # Go forward
agent-browser reload          # Reload the page
agent-browser close           # Close the browser
```

### Snapshot (page analysis)

```bash
agent-browser snapshot        # Full accessibility tree
agent-browser snapshot -i     # Interactive elements only (recommended)
agent-browser snapshot -c     # Compact output
agent-browser snapshot -d 3   # Limit depth to 3
```

### Interaction (using @refs from the snapshot)

```bash
agent-browser click @e1           # Click
agent-browser dblclick @e1        # Double-click
agent-browser fill @e2 "text"     # Clear, then type
agent-browser type @e2 "text"     # Type without clearing
agent-browser press Enter         # Press a key
agent-browser press Control+a     # Key combination
agent-browser hover @e1           # Hover
agent-browser check @e1           # Check a checkbox
agent-browser uncheck @e1         # Uncheck a checkbox
agent-browser select @e1 "value"  # Select a dropdown option
agent-browser scroll down 500     # Scroll the page
agent-browser scrollintoview @e1  # Scroll an element into view
```

### Getting information

```bash
agent-browser get text @e1        # Get an element's text
agent-browser get value @e1       # Get an input's value
agent-browser get title           # Get the page title
agent-browser get url             # Get the current URL
```

### Screenshots

```bash
agent-browser screenshot          # Screenshot to stdout
agent-browser screenshot path.png # Save to a file
agent-browser screenshot --full   # Full page
```

### Waiting

```bash
agent-browser wait @e1                     # Wait for an element
agent-browser wait 2000                    # Wait for milliseconds
agent-browser wait --text "Success"        # Wait for text
agent-browser wait --load networkidle      # Wait for network idle
```

### Semantic locators (an alternative to refs)

```bash
agent-browser find role button click --name "Submit"
agent-browser find text "Sign In" click
agent-browser find label "Email" fill "user@test.com"
```

## Example: submitting a form

```bash
agent-browser open https://example.com/form
agent-browser snapshot -i
# Example output: textbox "Email" [ref=e1], textbox "Password" [ref=e2], button "Submit" [ref=e3]

agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "password123"
agent-browser click @e3
agent-browser wait --load networkidle
agent-browser snapshot -i  # Check the result
```

## Example: authentication with saved state

```bash
# Log in once
agent-browser open https://app.example.com/login
agent-browser snapshot -i
agent-browser fill @e1 "username"
agent-browser fill @e2 "password"
agent-browser click @e3
agent-browser wait --url "**/dashboard"
agent-browser state save auth.json

# Later sessions: load the saved state
agent-browser state load auth.json
agent-browser open https://app.example.com/dashboard
```

## Sessions (parallel browsers)

```bash
agent-browser --session test1 open site-a.com
agent-browser --session test2 open site-b.com
agent-browser session list
```

## JSON output (for parsing)

Add `--json` for machine-readable output:

```bash
agent-browser snapshot -i --json
agent-browser get text @e1 --json
```

## Debugging

```bash
agent-browser open example.com --headed  # Show the browser window
agent-browser console                    # Show console messages
agent-browser errors                     # Show page errors
```

## Usage notes

### Timing

- Always take a fresh snapshot after navigating to a page
- Use the `wait` command to wait for dynamic content to load
- If an element is not visible, scroll it into the viewport with `scrollintoview`

### Security

- Keep credentials secure, and never commit state files (such as `auth.json`) to a public repository
- Use dedicated test accounts in test environments

### Performance

- Avoid unnecessary full-page screenshots
- Use `snapshot -i` to narrow the output to interactive elements when appropriate
- Use sessions when several browser operations are needed

### Troubleshooting

- **Element not found**: rerun `snapshot -i` to get fresh refs
- **Click does not work**: check that the element is visible, and use `scrollintoview` if needed
- **Timeout**: wait for the page to finish loading with `wait --load networkidle`

## Use cases

### Testing web applications

```bash
# Test the sign-up flow
agent-browser open https://app.example.com/signup
agent-browser snapshot -i
agent-browser fill @e1 "testuser@example.com"
agent-browser fill @e2 "SecurePass123!"
agent-browser click @e3
agent-browser wait --text "Welcome"
agent-browser screenshot signup-success.png
```

### Data scraping

```bash
# Extract product information
agent-browser open https://shop.example.com/products
agent-browser snapshot
agent-browser get text @e5 --json > product-name.json
agent-browser get text @e6 --json > product-price.json
```

### Visual regression testing of the UI

```bash
# Take screenshots at several screen sizes
agent-browser open https://example.com
agent-browser screenshot desktop.png
agent-browser resize 768 1024
agent-browser screenshot tablet.png
agent-browser resize 375 667
agent-browser screenshot mobile.png
```

### Automated form filling

```bash
# Automate repetitive form input
agent-browser open https://forms.example.com
agent-browser snapshot -i
agent-browser fill @e1 "John Doe"
agent-browser fill @e2 "john@example.com"
agent-browser fill @e3 "555-1234"
agent-browser select @e4 "Option 2"
agent-browser check @e5
agent-browser click @e6
```

## Advanced features

### Multi-page workflows

```bash
# Step 1: Log in
agent-browser open https://app.example.com/login
agent-browser snapshot -i
agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "password"
agent-browser click @e3
agent-browser wait --url "**/dashboard"

# Step 2: Go to the settings page
agent-browser open https://app.example.com/settings
agent-browser snapshot -i
agent-browser fill @e7 "New Display Name"
agent-browser click @e8
agent-browser wait --text "Settings saved"
```

### Conditional actions

```bash
# Check for an error message
agent-browser open https://example.com/form
agent-browser snapshot -i
agent-browser fill @e1 "invalid-email"
agent-browser click @e2
agent-browser wait --text "Invalid email"
agent-browser screenshot error-state.png
```

### Session management

```bash
# Run tests in parallel
agent-browser --session user1 open https://app.example.com
agent-browser --session user2 open https://app.example.com
agent-browser --session user1 fill @e1 "user1@example.com"
agent-browser --session user2 fill @e1 "user2@example.com"
```

## Best practices

1. **Snapshot first**: always take a snapshot before interacting
2. **Explicit waits**: handle asynchronous operations with the `wait` command
3. **Error handling**: use screenshots to capture unexpected states
4. **Reuse state**: save the authentication state to avoid logging in repeatedly
5. **JSON output**: use the `--json` flag for automation and parsing
6. **Isolate sessions**: use sessions for parallel tests
7. **Debug mode**: use `--headed` to troubleshoot problems

## Using agent-browser alongside MCP tools

In Claude Code, MCP (Model Context Protocol) tools for the Chrome browser are available in addition to agent-browser.

### agent-browser vs MCP tools

| Feature              | agent-browser     | MCP tools (Chrome)      |
| -------------------- | ----------------- | ----------------------- |
| Ease of use          | CLI-based, simple | Programmatic            |
| Snapshots            | ✅ Text-based     | ✅ DOM structure        |
| Element references   | `@e1`, `@e2`      | `uid`-based             |
| Session management   | ✅                | ✅                      |
| Screenshots          | ✅                | ✅                      |
| Network monitoring   | ❌                | ✅ DevTools integration |
| Performance analysis | ❌                | ✅ Tracing              |

### Choosing between them

**Use agent-browser for:**

- Simple form filling and navigation
- Cases where text-based element references are preferable
- Lightweight, quick operations

**Use MCP tools (Chrome) for:**

- Cases that need network requests monitored
- Detailed analysis of console logs
- Performance tracing and optimization
- More complex DOM manipulation

## Summary

agent-browser is a powerful tool that makes web browser automation simple. Its snapshot-based workflow, ref system, and rich command set let you carry out tasks such as web testing, data extraction, and form automation efficiently.

With this skill, users can automate interactions with web pages, cut down on repetitive tasks, and improve the quality of their web applications.

---
"slack": minor
---

Add Claude Code Channels support (research preview): a local `slack-channel` MCP server that bridges Slack to Claude Code sessions in real time over Socket Mode. Receives DMs, @mentions, and watched-channel messages as channel events; exposes `reply`, `react`, `manage_access`, and `manage_channels` tools; gates senders behind a pairing-based allowlist; and relays tool-permission prompts to Slack. Ported from slackapi/slack-skills-plugin#23 by @marciogranzotto.

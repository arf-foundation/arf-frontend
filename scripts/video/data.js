// Values extracted by build_data.py from a recorded run of enterprise c3ed234's
// examples/ontap_mcp_proxy_demo.py (branch 8adcd37) against the SIMULATED cluster,
// fresh DB claude_video_act2_20261003090641, 2026-10-03. Act 2 only.
window.RUN = {
 "act2": {
  "advertised": 11,
  "volumes": [
   "app_data",
   "app_data_dr",
   "scratch"
  ],
  "reads_ledger": 0,
  "snapshot": {
   "status": "completed",
   "verified": {
    "snapshot_present": true
   }
  },
  "snapshot_events": [
   "execution_attempted",
   "execution_outcome"
  ],
  "delete_pending": {
   "status": "pending_approval",
   "approval_required": "admin",
   "approval_id": "appr_240cd034b49a4d08b5d8fb46152eb99e"
  },
  "scratch_pending": {
   "status": "pending_approval",
   "approval_required": "admin",
   "approval_id": "appr_0589f689f8034b429d1191870bc484b6"
  },
  "delete_done": {
   "status": "completed",
   "verified": {
    "volume_present": false
   }
  },
  "refused": {
   "status": "refused",
   "reason": "ARF has no model of 'delete_lun': it cannot say what the call would change or whether it could be undone, so it is refused rather than forwarded or sent for an approval nobody could make informed"
  },
  "refused_upstream": 0,
  "chain_entries": 10,
  "head": "6e0909d6936551e3",
  "edited": "REFUSED: entry 0's hash does not match its content",
  "truncated_entries": 9,
  "head_after": "25d63d31ea80ece6"
 }
};

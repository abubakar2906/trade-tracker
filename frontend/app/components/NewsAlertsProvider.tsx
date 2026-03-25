"use client";

import { useNewsAlerts } from "../hooks/useNewsAlerts";

export function NewsAlertsProvider() {
  useNewsAlerts();
  return null;
}

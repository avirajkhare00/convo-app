import type { Event, User } from "@prisma/client";
import { pick } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import { updateEvents } from "src/server/utils/google/updateEvents";
import { DEFAULT_HOST } from "src/utils/constants";

export type FullEvent = Event & {
  proposer: User;
};

export default async function createEventHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headersList = req.headers;
  const { host }: { host?: string | undefined | string[] } = pick(headersList, [
    "host",
  ]);

  const {
    events,
  }: { events: { updated: Array<FullEvent>; deleted: Array<FullEvent> } } =
    pick(req.body, ["events"]);

  if (!events) {
    throw new Error("`event` not found in req.body");
  }

  const ids = await updateEvents({
    events,
    reqHost: host || DEFAULT_HOST,
  });

  res.status(200).json({
    data: ids,
  });
}

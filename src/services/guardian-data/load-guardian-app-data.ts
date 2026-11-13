import { getGuardianBootstrap } from "./get-guardian-bootstrap";
import { mapGuardianBootstrap } from "./map-guardian-bootstrap";

export async function loadGuardianAppData() {
  return mapGuardianBootstrap(await getGuardianBootstrap());
}

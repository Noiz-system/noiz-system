import { getTranslations } from "next-intl/server";

export default async function LandingPage() {
  const t = await getTranslations("Hero");

  return <main>{t("kicker")}</main>;
}

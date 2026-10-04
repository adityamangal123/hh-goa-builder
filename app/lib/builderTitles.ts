export function getBuilderTitle(role: string) {
  const value = role.toLowerCase();

  if (
    value.includes("ai") ||
    value.includes("machine learning") ||
    value.includes("ml")
  ) {
    return "The Machine Whisperer";
  }

  if (
    value.includes("frontend") ||
    value.includes("front-end") ||
    value.includes("ui")
  ) {
    return "The Pixel Architect";
  }

  if (
    value.includes("backend") ||
    value.includes("back-end")
  ) {
    return "The Systems Builder";
  }

  if (
    value.includes("full stack") ||
    value.includes("full-stack")
  ) {
    return "The Code Alchemist";
  }

  if (
    value.includes("designer") ||
    value.includes("design")
  ) {
    return "The Experience Crafter";
  }

  if (
    value.includes("cyber") ||
    value.includes("security")
  ) {
    return "The Digital Guardian";
  }

  if (
    value.includes("data") ||
    value.includes("analytics")
  ) {
    return "The Data Explorer";
  }

  if (
    value.includes("mobile") ||
    value.includes("android") ||
    value.includes("ios")
  ) {
    return "The Mobile Maker";
  }

  return "The Future Builder";
}
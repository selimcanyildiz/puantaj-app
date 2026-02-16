export const getData = (key) =>
  JSON.parse(localStorage.getItem(key)) || []

export const setData = (key, data) =>
  localStorage.setItem(key, JSON.stringify(data))

export const initDefaultData = () => {
  const sites = getData("sites") || []

  const hasLeave = sites.some(s => s.code === "LEAVE")

  if (!hasLeave) {
    sites.push({
      id: 0,
      name: "İzin",
      code: "LEAVE"
    })
    setData("sites", sites)
  }
}

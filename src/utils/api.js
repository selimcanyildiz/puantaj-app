const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  }
  if (body) options.body = JSON.stringify(body)

  const res = await fetch(`${BASE_URL}${path}`, options)

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Sunucu hatası")
  }

  return res.json()
}

export const login = (username, password) =>
  request("POST", "/auth/login", { username, password })

export const getPersonnel    = ()     => request("GET",    "/personnel/")
export const addPersonnel    = (name) => request("POST",   "/personnel/", { name })
export const deletePersonnel = (id)   => request("DELETE", `/personnel/${id}`)

export const getSites    = ()     => request("GET",    "/sites/")
export const addSite     = (name) => request("POST",   "/sites/", { name })
export const deleteSite  = (id)   => request("DELETE", `/sites/${id}`)

export const getPuantaj       = (month)                  => request("GET",    `/puantaj/?month=${month}`)
export const setPuantajCell   = (person_id, date, site_id) => request("POST", "/puantaj/set", { person_id, date, site_id })
export const clearPuantajCell = (person_id, date)        => request("DELETE", `/puantaj/clear?person_id=${person_id}&date=${date}`)
export const getMonthlySummary = (month)                 => request("GET",    `/puantaj/summary?month=${month}`)
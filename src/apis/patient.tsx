const BASE_URL: string = "http://localhost:8080";

// get patient and create docs by patient ID
export const getPatientAndCreateDocsById = async (patientId: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/ehealth/init?clientId=${patientId}`,
      {
        method: "POST",
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching patient documents:", error);
    throw error;
  }
};

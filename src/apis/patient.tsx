const BASE_URL: string = "http://localhost:8080";

// get patient and create docs by patient ID
export const getPatientAndCreateDocsById = async (patientId: number) => {
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

// get latest prescription by client ID
export const getLatestPrescriptionByClientId = async (clientId: number) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/prescriptions/client/${clientId}/latest`,
      {
        method: "GET",
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching latest prescription:", error);
    throw error;
  }
};

// get latest requisition by client ID
export const getLatestRequisitionByClientId = async (clientId: number) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/requisitions/client/${clientId}/latest`,
      {
        method: "GET",
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching latest requisition:", error);
    throw error;
  }
};

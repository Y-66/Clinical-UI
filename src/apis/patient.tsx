const BASE_URL: string = "http://127.0.0.1:8000/api";

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

// get latest diagnosis by patient ID
export const getLatestDiagnosisByPatientId = async (patientId: number) => {
  try {
    const res = await fetch(`${BASE_URL}/diagnosis/latest/${patientId}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Diagnosis API response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching latest diagnosis:", error);
    throw error;
  }
};

// generate workflow orders (prescription and requisition)
export const generateWorkflowOrders = async (patientId: number) => {
  try {
    const res = await fetch(`${BASE_URL}/workflow/generate-orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patient_id: patientId }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Workflow orders response:", data);
    return data;
  } catch (error) {
    console.error("Error generating workflow orders:", error);
    throw error;
  }
};

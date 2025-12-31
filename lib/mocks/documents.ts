export interface Document {
  id: string;
  studySetId: string;
  filename: string;
  status: "uploaded" | "extracting" | "extracted" | "error";
  pageCount: number;
  uploadedAt: string;
}

export const mockDocuments: Document[] = [
  {
    id: "doc1",
    studySetId: "1",
    filename: "astronomy_intro.pdf",
    status: "extracted",
    pageCount: 24,
    uploadedAt: "2024-01-15T10:05:00Z",
  },
  {
    id: "doc2",
    studySetId: "1",
    filename: "solar_system.pdf",
    status: "extracted",
    pageCount: 18,
    uploadedAt: "2024-01-15T10:10:00Z",
  },
  {
    id: "doc3",
    studySetId: "1",
    filename: "planets_comparison.pdf",
    status: "extracted",
    pageCount: 12,
    uploadedAt: "2024-01-16T09:00:00Z",
  },
  {
    id: "doc4",
    studySetId: "2",
    filename: "ancient_egypt.pdf",
    status: "extracted",
    pageCount: 32,
    uploadedAt: "2024-01-10T09:05:00Z",
  },
  {
    id: "doc5",
    studySetId: "3",
    filename: "organic_chemistry_ch1.pdf",
    status: "extracting",
    pageCount: 0,
    uploadedAt: "2024-01-22T11:05:00Z",
  },
];

export function getDocumentsByStudySetId(studySetId: string): Document[] {
  return mockDocuments.filter((doc) => doc.studySetId === studySetId);
}


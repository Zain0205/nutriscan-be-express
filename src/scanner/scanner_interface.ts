export interface NutritionAnalysis {
  makanan: string;
  analisisNutrisi: {
    kalori: string;
    karbohidrat: string;
    protein: string;
    lemak: string;
    serat: string;
    vitamin: string[];
    mineral: string[];
  };
  manfaat: string[];
  risiko: string[];
  cocokUntukDiet: string[];
  rekomendasi: string;
}
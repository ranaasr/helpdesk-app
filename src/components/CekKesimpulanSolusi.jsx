import { ambilSemuaFaktaPermasalahan } from "../database/faktaPermasalahanService";
import { ambilSemuaRules } from "../database/rulesService";
import { ambilSemuaKesimpulan } from "../database/kesimpulanService";
import { ambilSemuaSolusi } from "../database/solusiService";

const CekKesimpulanSolusi = async (daftarFakta) => {
  const rulesData = [];
  await new Promise((resolve) => {
    ambilSemuaRules((rules) => {
      rules.forEach((doc) => {
        rulesData.push(doc);
      });
      resolve();
    });
  });

  const solutionsFound = [];
  const matchedFactIds = new Set();

  for (let rule of rulesData) {
    const { id_fakta, id_kesimpulan, id_solusi } = rule;

    if (id_fakta.every((fact) => daftarFakta.includes(fact))) {
      const daftarFakta = [];

      await ambilSemuaFaktaPermasalahan((faktaData) => {
        id_fakta.forEach((fakta) => {
          faktaData.forEach((doc) => {
            if (doc.id === fakta) {
              daftarFakta.push(doc.nama_fakta);
              matchedFactIds.add(fakta);
            }
          });
        });
      });

      let conclusionText = "";
      await ambilSemuaKesimpulan((kesimpulanData) => {
        kesimpulanData.forEach((satuKesimpulan) => {
          if (satuKesimpulan.id === id_kesimpulan) {
            conclusionText = satuKesimpulan.nama_kesimpulan;
          }
        });
      });

      let solutionText = "";
      await new Promise((resolve) => {
        ambilSemuaSolusi((solusiData) => {
          solusiData.forEach((satuSolusi) => {
            if (satuSolusi.id === id_solusi) {
              solutionText = satuSolusi.nama_solusi;
            }
          });
          resolve();
        });
      });

      solutionsFound.push({
        facts: daftarFakta,
        conclusion: conclusionText,
        solution: solutionText,
      });
    }
  }

  const unmatchedFactsList = daftarFakta.filter(
    (factId) => !matchedFactIds.has(factId)
  );

  const partialSolutionsFound = [];

  for (let rule of rulesData) {
    const { id_fakta, id_kesimpulan, id_solusi } = rule;

    const intersectingFacts = id_fakta.filter((fact) =>
      unmatchedFactsList.includes(fact)
    );

    if (intersectingFacts.length > 0) {
      const daftarFaktaUnmatched = [];
      const daftarFaktaMatched = [];

      ambilSemuaFaktaPermasalahan((rules) => {
        id_fakta.forEach((fakta) => {
          rules.forEach((doc) => {
            if (doc.id === fakta) {
              if (unmatchedFactsList.includes(fakta)) {
                daftarFaktaUnmatched.push(doc.nama_fakta);
              } else {
                daftarFaktaMatched.push({
                  nama: doc.nama_fakta,
                  id: doc.id,
                });
              }
            }
          });
        });
      });

      let conclusionText = "";
      await ambilSemuaKesimpulan((kesimpulanData) => {
        kesimpulanData.forEach((satuKesimpulan) => {
          if (satuKesimpulan.id === id_kesimpulan) {
            conclusionText = satuKesimpulan.nama_kesimpulan;
          }
        });
      });

      let solutionText = "";
      await new Promise((resolve) => {
        ambilSemuaSolusi((solusiData) => {
          solusiData.forEach((satuSolusi) => {
            if (satuSolusi.id === id_solusi) {
              solutionText = satuSolusi.nama_solusi;
            }
          });
          resolve();
        });
      });

      partialSolutionsFound.push({
        factsMatched: daftarFaktaMatched,
        factsUnmatched: daftarFaktaUnmatched,
        conclusion: conclusionText,
        solution: solutionText,
      });
    }
  }
  return [solutionsFound, partialSolutionsFound];
};

export default CekKesimpulanSolusi;


const CA1_PROJECT = 'CA1 Project';
const ACNET_PROJECT = 'ACNET Project';
const C_302_PROJECT = 'C 302 Project';
const NWB_PROJECT = 'NWB Sample Project';
const HH_CELL_PROJECT = 'HH Cell Project';
const EYE_WIRE_PROJECT = 'Eye wire Project';
const PHARYNGEAL_PROJECT = 'Pharyngeal Project';
const C_ELEGANS_PVDR_PROJECT = 'C-Elegans PVDR Project';
const C_ELEGANS_MUSCLE_PROJECT = 'C-Elegans Muscle Model Project';
const C_ELEGANS_CONNECTOME_PROJECT = 'C-Elegans Connectome Project';
const CYLINDER_PROJECT = 'https://raw.githubusercontent.com/openworm/org.geppetto.samples/development/UsedInUnitTests/cylinder/geppetto.json';

export const Projects = Object.freeze({
  HH_CELL: 1,
  ACNET: 5,
  C302: 6,
  CA1: 3,
  PVDR: 8,
  CONNECTOME: 16,
  PMUSCLE: 4,
  CYLINDER: CYLINDER_PROJECT,
  PHARYNGEAL: 58,
  EYEWIRE: 9,
});

export const getProjectNameById = id => {
  switch (id) {
  case 1:
    return HH_CELL_PROJECT;

  case 3:
    return CA1_PROJECT;

  case 4:
    return C_ELEGANS_MUSCLE_PROJECT;

  case 5:
    return ACNET_PROJECT;

  case 6:
    return C_302_PROJECT;

  case 8:
    return C_ELEGANS_PVDR_PROJECT;

  case 9:
    return EYE_WIRE_PROJECT;

  case 16:
    return C_ELEGANS_CONNECTOME_PROJECT;

  case 18:
    return NWB_PROJECT;

  case 58:
    return PHARYNGEAL_PROJECT;

  
  default:
    return '';
  }
};

export const getPersistenceProjectJSON = id => {
	switch (id) {
	case 1:
		return PERSISTENCE_PROJECT_1;
	case 2:
		return PERSISTENCE_PROJECT_2;
	case 3:
		return PERSISTENCE_PROJECT_3;

	default:
		return '';
	}
};

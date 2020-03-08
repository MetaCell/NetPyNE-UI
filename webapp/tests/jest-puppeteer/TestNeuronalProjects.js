
import {
  testSingleComponentHHProject,
  testACNET2Project,
  testC302NetworkProject,
  testCa1Project,
  testPVDRNeuronProject,
  testPMuscleCellProject,
  testC302Connectome,
} from './NeuronalTestsLogic'
import { testDashboard } from "./functions";


describe('Test Neuronal Projects', () => {
  beforeAll(async () => {
    await jestPuppeteer.resetBrowser();
    jest.setTimeout(200000);
  });


  describe('Test Dashboard', () => testDashboard());
  describe('Single Component HH Project', () => testSingleComponentHHProject());
  describe('Acnet Project', () => testACNET2Project());
  describe('C302 Network Project', () => testC302NetworkProject());
  describe('Ca1 Project', () => testCa1Project());
  describe('cElegansPVDR Project', () => testPVDRNeuronProject());
  describe('cElegansMuscleModel Project', () => testPMuscleCellProject());
  describe('cElegansConnectome Project', () => testC302Connectome());

});

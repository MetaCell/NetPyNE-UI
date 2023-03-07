import Joyride from 'react-joyride';
import { useSelector } from 'react-redux';
import { incrementTutorialStep } from '../../redux/actions/tutorials';

const incrementStepIndex = () => {
  incrementTutorialStep();
}

const Tutorial = () => {
  const steps = useSelector((state) => state.tutorial.steps);
  const currentStep = useSelector((state) => state.tutorial.tourStep);
  const running = useSelector((state) => state.tutorial.tourRunning);

  return (
    <div>
      <Joyride 
      steps={steps} 
        run={running} 
        stepIndex={currentStep} 
        callback={incrementStepIndex}
        />
    </div>
  );
}

export default Tutorial ;
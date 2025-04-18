// Static content loader for the paper
import toc from '../../public/content/toc.json';
import introduction from '../../public/content/introduction.json';
import galotsTheory from '../../public/content/galois-theory.json';
import hapdAlgorithm from '../../public/content/hapd-algorithm.json';
import matrixApproach from '../../public/content/matrix-approach.json';
import matrixComputational from '../../public/content/matrix-computational.json';
import matrixVerification from '../../public/content/matrix-verification.json';
import equivalence from '../../public/content/equivalence.json';
import subtractiveAlgorithm from '../../public/content/subtractive-algorithm.json';
import numericalValidation from '../../public/content/numerical-validation.json';
import objections from '../../public/content/objections-tex.json';
import conclusion from '../../public/content/conclusion.json';
import implementationExamples from '../../public/content/implementation-examples.json';
import bibliography from '../../public/content/bibliography.json';

// Map content files to their keys for easy lookup
const content: Record<string, any> = {
  'introduction': introduction,
  'galois-theory': galotsTheory,
  'hapd-algorithm': hapdAlgorithm,
  'matrix-approach': matrixApproach,
  'matrix-computational': matrixComputational,
  'matrix-verification': matrixVerification,
  'equivalence': equivalence,
  'subtractive-algorithm': subtractiveAlgorithm,
  'numerical-validation': numericalValidation,
  'objections-tex': objections,
  'conclusion': conclusion,
  'implementation-examples': implementationExamples,
  'bibliography': bibliography
};

export default {
  toc,
  content
}; 
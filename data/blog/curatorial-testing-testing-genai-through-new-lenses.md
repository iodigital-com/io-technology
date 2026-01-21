---
title: 'The pivot: Testing through new lenses?'
date: '2026-01-21'
tags: ['testing', 'ai', 'quality-assurance']
images:
  [
    '/articles/curatorial-testing-testing-genai-through-new-lenses/curatorial-testing-testing-genai-through-new-lenses-hero.jpeg',
  ]
summary: 'Exploring how curatorial practices from museum exhibition production can provide a fresh perspective on testing GenAI solutions, embracing probabilistic outcomes and interpretive approaches.'
authors: ['shela-hagglund']
theme: 'blue'
---

I attended [EuroSTAR](https://conference.eurostarsoftwaretesting.com/) in June 2025, an annual Software Testing conference, which has incubated numerous groundbreaking software testing ideas and models throughout the years. Isabel Evans opened the second day with her keynote speech ["Breaking Test Stereotypes: Who is Testing and Why it Matters"](https://conference.eurostarsoftwaretesting.com/event/2025/breaking-test-stereotypes-who-is-testing-and-why-it-matters/). She highlighted through her own academic research the importance of heterogeneity in the Software Testing community and how it impacts the perceived value of software (aka quality). She pointed out that testers should have different backgrounds since diversity benefits the testing practices. After all, testing is a mindset.
Testers seek information and gather data points by challenging assumptions, asking questions and experimenting. A heterogenous group asks a wider range of questions, hence gathers more diverse information. Their perspectives and approaches vary and lay the foundation for multidimensional testing.

Even though I studied computer science I never had software testing in mind when contemplating my career. As a matter of fact, I wanted to work with art and cultural expressions. I stumbled upon this career 13 years ago and haven't left it since. The reason is the heterogeneity Evans spoke about; I can combine free, creative thinking with software development and requirement analysis. It doesn't matter what kind of software it is; mobile applications, CMS, ERP, GenAI etc - the mindset is the same; elicit information, information and information.

## Getting inspired from other disciplines

Last year I completed a one-year programme in Exhibition Curation and Production at [Linköping University](https://liu.se/). What does this have to do with testing software, one might ask. Well, quite a lot it turns out. And even more, testing GenAI.
One of the main objectives in modern museum exhibition productions is the creation of knowledge via the ['Method of Things'](https://tingenesmetode.no/index.php/litteratur). The knowledge base should be wide enough to be 'digested' by the visitor, while maintaining historical authenticity and establishing provenance. The method entails traditional museum activities like artifact preservation, cataloguing and acquisition. The curatorial work creates a different essence to the artifact collection by redefining the role of the visitor, the museum itself and society.
To secure a broader role analysis it's important that the curatorial team is diverse. A wider set of data drives the team's work in creating the Exhibition Narrative.
How is that collected? By asking questions. By challenging assumptions. By researching, studying, experimenting and adapting the outcomes to the requirements. In other words, the production/ curatorial team derives contextual information from the catalogue through 'testing'. The artifacts are placed in a 'contextual' room, a room which goes beyond the physical one. They create a narrative by placing the artifacts in clusters/lenses which encompass social constructs, historical insights and let's face it - business incentives.

Simply put, information is mined by analysing data from and for the existing catalogue; the information is translated into a multidimensional narrative which is communicated via the exhibition to a diverse audience. Hence, the production is directly dependent on the curatorial interpretation of data. The narrative is everchanging through the interpretation, continuous assessment, re-organizing and ongoing adaptation of the exhibition's catalogue. The perceived value of the narrative is directly linked to the visitor's experience, and its evaluation is based on metrics which also change over time.
As implied above there are no deterministic criteria for assessing an exhibition. The curatorial decisions drive the production; the overall quality is however 'in the eye of the beholder'. A variety of curatorial 'lenses' can reveal different meanings and narratives leading to a more compelling exhibition.

## The parallels

I can see many parallels between the curatorial work and testing GenAI solutions. They are both fundamentally interpretive, probabilistic practices that deal with meaning-making rather than deterministic verification.
Just like social constructs are portrayed through narration in the museal context, so are GenAI solutions giving form to implicit patterns from their knowledge base. In the case of exhibition curation there is a statistical space of possible artifact arrangements, all generating different narratives and interpretations. Hence, each curatorial choice influences the visitor's experience. Yet, one cannot predict how; probabilistically yes, but never with certainty. Similarly, GenAI-testing is about understanding the probability distribution of the outcomes – not only about verifying the specific outputs per say. A diverse testing team will cover the probability sphere more easily by asking different questions about the probability distributions.

## My suggestion: using curatorial lenses

The generative models are evolving continuously. What might have constituted a User/Business-accepted output a few weeks ago might not be reproduceable today.
This calls for a new set of criteria and oracles, and raises almost philosophical questions; how can we work around the generative models' stochastic nature and subjectivity? How can we approach traceability in this dynamic setting? How are we integrating Evaluation criteria into our existing pool of Non-functional requirements (NFR)? Are we in need of new terminology to secure a common understanding or should we go back to the basics? How can we as a team assure quality of GenAI products and build in testability?

Software testers have been adapting their practices, and our current 'AI-boom' is no exception. The ongoing discussions and debates in the testing community are for me a clear sign of our ability to adapt. We are embracing the plasticity of GenAI which is already reflected in our practices. We should focus on understanding the conditions that generate the possible outcomes. Parameters like training data, prompts, model updates, instructions, user history, memories, weights, temperature, all constitute the end-product. The expected results during our testing are still context-driven, the context is however up for interpretation. This requires continuous assessment and adaptive regression testing to secure quality with relevant evaluation metrics.

Binary pass/fail tests could be deemed irrelevant without their corresponding probabilities since GenAI behaviour is probabilistic. We are trying to measure uncertainty, probability, and work with multiple valid interpretations rather than deterministic outcomes. Therefore, production monitoring might become more relevant than ever, binary pass/fail verification could be replaced by semantic evaluation and software validation could require a broader definition of its consistency.
With all above said, I believe we need a more interpretive/curatorial approach when testing and assessing generative software for example by using different 'testing lenses'.

Becoming 'quality curators' or 'curatorial testers' through interpretive testing could be a way forward.

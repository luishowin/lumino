export default {
  "id": "biology-dna-and-inheritance-intro",
  "subject": "biology",
  "topicId": "dna-and-inheritance",
  "kind": "introduction",
  "level": "advanced",
  "title": "Introduction to DNA and inheritance",
  "estimatedMinutes": 4,
  "intro": {
    "hook": "Two parents can share a visible trait while their child shows a different one. How can allele combinations explain this?",
    "tutorLine": "Count the two ways to get Aa."
  },
  "goal": [
    "Relate genes, alleles and traits",
    "Use a simple genetic cross to predict probabilities"
  ],
  "definitions": [
    {
      "term": "Gene",
      "meaning": "A length of DNA that provides information for a functional product."
    },
    {
      "term": "Allele",
      "meaning": "An alternative form of a gene."
    },
    {
      "term": "Genotype",
      "meaning": "The allele combination an organism has at a locus."
    }
  ],
  "concept": [
    {
      "title": "Track two copies",
      "body": "In a simple diploid cross, an offspring inherits one allele at a locus from each parent.",
      "alt": "Write each parent’s possible gametes along the edges of a square and pair them in the cells.",
      "tutorLine": "A probability applies to each offspring."
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Cross two heterozygotes",
      "steps": [
        "For Aa × Aa, each parent can pass A or a with equal probability.",
        "The four equally likely combinations are AA, Aa, Aa and aa."
      ],
      "tutorLine": "Count the two ways to get Aa."
    },
    {
      "kind": "real-world",
      "title": "Interpret a prediction",
      "steps": [
        "If A is fully dominant, only aa shows the recessive trait.",
        "Each offspring in this cross has a one-in-four chance of showing it."
      ],
      "tutorLine": "A probability applies to each offspring."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "biology-dna-and-inheritance-intro-term",
      "skillId": "dna-and-inheritance",
      "q": "Which term fits this description? An alternative form of a gene.",
      "options": [
        "Allele",
        "Chromosome",
        "Gene",
        "Genotype"
      ],
      "answer": 0,
      "why": "Allele — An alternative form of a gene."
    },
    {
      "type": "mcq",
      "id": "biology-dna-and-inheritance-intro-apply",
      "skillId": "dna-and-inheritance",
      "q": "Which genotype is heterozygous?",
      "options": [
        "AA (two dominant alleles)",
        "aa (two recessive alleles)",
        "Aa (two different alleles)",
        "A (one allele)"
      ],
      "answer": 2,
      "why": "Aa contains two different alleles."
    },
    {
      "type": "mcq",
      "id": "biology-dna-and-inheritance-intro-check",
      "skillId": "dna-and-inheritance",
      "q": "For Aa × Aa, what fraction of offspring is expected to be aa?",
      "options": [
        "One half",
        "All",
        "Three quarters",
        "One quarter"
      ],
      "answer": 3,
      "why": "Only one of the four equally likely combinations is aa."
    },
    {
      "type": "explain",
      "id": "biology-dna-and-inheritance-intro-explain",
      "skillId": "dna-and-inheritance",
      "q": "Must four offspring include exactly one with genotype aa?",
      "input": [
        "type",
        "speech"
      ],
      "model": "No. One quarter is a probability for each offspring, so small families can differ from the expected ratio."
    }
  ],
  "summary": {
    "takeaways": [
      "In a simple diploid cross, an offspring inherits one allele at a locus from each parent.",
      "The four equally likely combinations are AA, Aa, Aa and aa.",
      "Each offspring in this cross has a one-in-four chance of showing it."
    ],
    "formula": "Combine one allele from each parent."
  },
  "sandbox": null
};

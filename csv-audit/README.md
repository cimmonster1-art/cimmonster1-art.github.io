# CSV quality audit

A small read-only Python example for checking incoming CSV files before cleanup.

```sh
python audit.py sample.csv --required id email --key id
python -m unittest -v
```

Reports missing fields, outer whitespace, exact duplicate rows, duplicate nonempty keys and incorrect column counts. Supports UTF-8 with an optional BOM, quoted commas and multiline fields. IDs remain strings, so `001` and `1` are distinct. Reports refer to logical CSV record numbers including the header, not physical line numbers.

No values are corrected or deleted. Source files remain unchanged; the JSON report contains column names and record references, not cell contents. Empty keys are counted as missing but not duplicate keys. Required-field checks must be requested explicitly. Empty/duplicate headers and unknown column arguments fail clearly. Review findings against business rules before making corrections.

Limits: comma-delimited UTF-8 only, exact case-sensitive matching, duplicate signatures held in memory, no email validation or type inference. Not designed for unbounded files. The sample is fictional, with reserved `.invalid` email addresses. No client data or paid-client claims.

Created 13 November 2026 with OpenAI Codex assistance under Charli Myers's direction. Personal portfolio demonstration.

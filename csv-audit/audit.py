"""Read-only CSV quality report. Python standard library only."""
import argparse
import csv
import json
from collections import Counter
from pathlib import Path


def audit(path, required=(), keys=()):
    with Path(path).open(encoding='utf-8-sig', newline='') as source:
        reader = csv.reader(source)
        headers = next(reader, None)
        if not headers or any(not h.strip() for h in headers):
            raise ValueError('A non-empty header is required for each column')
        if len(set(headers)) != len(headers):
            raise ValueError('Duplicate column headers are ambiguous')
        unknown = set(required) | set(keys)
        unknown -= set(headers)
        if unknown:
            raise ValueError('Unknown columns: ' + ', '.join(sorted(unknown)))
        missing = Counter()
        seen_rows, seen_keys = {}, {}
        issues = []
        count = 0
        for record, row in enumerate(reader, 2):
            count += 1
            if len(row) != len(headers):
                issues.append({'record': record, 'type': 'wrong_column_count', 'actual': len(row), 'expected': len(headers)})
                continue
            values = dict(zip(headers, row))
            for name, value in values.items():
                if not value.strip():
                    missing[name] += 1
                    if name in required:
                        issues.append({'record': record, 'type': 'required_empty', 'column': name})
                if value != value.strip():
                    issues.append({'record': record, 'type': 'outer_whitespace', 'column': name})
            signature = tuple(row)
            if signature in seen_rows:
                issues.append({'record': record, 'type': 'duplicate_row', 'first_record': seen_rows[signature]})
            else:
                seen_rows[signature] = record
            if keys:
                key = tuple(values[k] for k in keys)
                if all(v.strip() for v in key):
                    if key in seen_keys:
                        issues.append({'record': record, 'type': 'duplicate_key', 'columns': list(keys), 'first_record': seen_keys[key]})
                    else:
                        seen_keys[key] = record
    return {'records': count, 'columns': headers, 'missing_by_column': {h: missing[h] for h in headers}, 'issues': issues}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('csv')
    parser.add_argument('--required', nargs='*', default=[])
    parser.add_argument('--key', nargs='*', default=[])
    args = parser.parse_args()
    try:
        print(json.dumps(audit(args.csv, args.required, args.key), indent=2))
    except (ValueError, OSError, UnicodeError, csv.Error) as error:
        parser.exit(2, str(error) + '\n')


if __name__ == '__main__':
    main()

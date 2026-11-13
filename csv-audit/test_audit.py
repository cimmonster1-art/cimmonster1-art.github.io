import tempfile
import unittest
from pathlib import Path
from audit import audit


class AuditTests(unittest.TestCase):
    def run_csv(self, text, **kwargs):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'input.csv'
            path.write_text(text, encoding='utf-8')
            result = audit(path, **kwargs)
            self.assertEqual(path.read_text(encoding='utf-8'), text)
            return result

    def test_missing_duplicates_and_malformed(self):
        report = self.run_csv('id,name\n01,A\n02, \n01,A\n03,B,extra\n', required=['name'], keys=['id'])
        self.assertEqual(report['records'], 4)
        self.assertEqual(report['missing_by_column']['name'], 1)
        self.assertEqual({i['type'] for i in report['issues']}, {'required_empty','outer_whitespace','duplicate_row','duplicate_key','wrong_column_count'})

    def test_quoted_multiline_bom_and_leading_zero(self):
        report = self.run_csv('\ufeffid,note\n001,"one\ntwo"\n1,"comma, here"\n', keys=['id'])
        self.assertEqual(report['records'], 2)
        self.assertEqual(report['issues'], [])

    def test_reject_ambiguous_headers(self):
        for text in ['id,id\n1,2\n', 'id,\n1,2\n', '']:
            with self.assertRaises(ValueError):
                self.run_csv(text)

    def test_reject_unknown_columns(self):
        with self.assertRaises(ValueError):
            self.run_csv('id\n1\n', required=['email'])

    def test_blank_keys_not_reported_as_duplicates(self):
        report = self.run_csv('id,name\n,A\n,B\n', keys=['id'])
        self.assertEqual(report['issues'], [])


if __name__ == '__main__':
    unittest.main()

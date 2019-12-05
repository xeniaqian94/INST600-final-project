import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

affiliation_filename = "/Users/lynan/Downloads/ORCID_migrations_2018_summary_add_fields/ORCID_migrations_2018_affiliation.csv"
affiliation = pd.read_csv(affiliation_filename, delimiter="\t")
df = pd.DataFrame(affiliation)
print(df.head())

# To answer the first question "where do most researchers move to" - city
# First, to retrieve people who have more than one city
num_affiliations_per_person = df.groupby('orcid_id').count()
num_affiliations_per_person = num_affiliations_per_person[num_affiliations_per_person['city'] > 1]
print(num_affiliations_per_person)
orcid_id_more_than_one_affiliation = len(num_affiliations_per_person)
print(orcid_id_more_than_one_affiliation)

# For each person, aggregate all its city type
set_city_per_person = df.groupby('orcid_id')['city'].nunique().to_frame()
print(set_city_per_person)
print(set_city_per_person['city'].value_counts())

# only keep those who has more than one city
set_city_per_person_more_than_one = set_city_per_person[set_city_per_person['city'] > 1]
print(len(set_city_per_person_more_than_one))

unique_orcid_ids = set(set_city_per_person_more_than_one.index.unique())
set_city_per_person_more_than_one_filtered = df.loc[df['orcid_id'].isin(unique_orcid_ids)]

# find the city move most to
city_per_person_more_than_one_filtered = set_city_per_person_more_than_one_filtered.dropna(subset=["city"])
print(city_per_person_more_than_one_filtered)

city_per_person_more_than_one_filtered = city_per_person_more_than_one_filtered.sort_values(by=["orcid_id","start_date"])

city_per_person_more_than_one_filtered['next_orcid_id'] = city_per_person_more_than_one_filtered.shift(-1).orcid_id
city_per_person_more_than_one_filtered['next_city'] = city_per_person_more_than_one_filtered.shift(-1).city
print(city_per_person_more_than_one_filtered)

def find_different_city(city_per_person_more_than_one_filtered):
    move_city = []
    for i, row in city_per_person_more_than_one_filtered.iterrows():
        if row['orcid_id'] == row ['next_orcid_id']:
            if row['city'] == row ['next_city']:
                move_city.append('null')
            else:
                move_city.append(row['next_city'])
        else:
            move_city.append('null')
    return move_city

city_per_person_more_than_one_filtered['move_city'] = find_different_city(city_per_person_more_than_one_filtered)
print(city_per_person_more_than_one_filtered)

city_per_person_more_than_one_filtered=city_per_person_more_than_one_filtered[~city_per_person_more_than_one_filtered['move_city'].isin(['null'])]
print(city_per_person_more_than_one_filtered)

a = city_per_person_more_than_one_filtered['move_city'].value_counts()
print(a)
a.to_csv('/Users/lynan/Desktop/q1_move_city.csv')

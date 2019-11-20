#!/usr/bin/env python
# coding: utf-8

# # ORCID_migrations_2018

# base on John Bohannon's script (https://datadryad.org/stash/downloads/file_stream/65430)

# Since 2018, ORCID public data started to use XSD v2_0, 
# And the archived file no longer contains JSON.
# In order to reuse John's script, we have to convert ORCID's XML file to JSON and modify the extraction function.
# 

# ORCID Conversion Library(https://github.com/ORCID/orcid-conversion-lib)

# XSD v2_0(https://github.com/ORCID/ORCID-Source/tree/master/orcid-model/src/main/resources/record_2.0)

# In[133]:


import json, os, sys
import pandas as pd

def file_generator_from_summary(summary_dir):
    flag=-1
    ''' Using a generator allows pausing and restarting
    without having to figure out where you left off. '''
    for z, json_dir in enumerate(os.listdir(summary_dir)):
        if os.path.isdir(os.path.join(summary_dir, json_dir)):
            for n, i in enumerate(os.listdir(os.path.join(summary_dir, json_dir))):
                if os.path.isfile(os.path.join(summary_dir,json_dir, i)):
                    flag=flag+1
                    yield (flag, os.path.join(summary_dir,json_dir, i))
            
def file_generator(json_dir):
    ''' Using a generator allows pausing and restarting
    without having to figure out where you left off. '''
    for n, i in enumerate(os.listdir(json_dir)):
        yield (n, os.path.join(json_dir, i))

def get_profiles(data, json_files, stop = None):
    ''' Iterate over JSON files and process them '''
    for n, filepath in json_files:
        # keep track of progress
        sys.stdout.flush()
        sys.stdout.write('\r{}'.format(n))
        # terminate if stop is specified and reached
        if stop is not None and n >= stop:
            return
        # process this JSON file and harvest the data
        if filepath.endswith(".json"):
            with open(filepath) as f:
                profile = json.load(f)
                for row in get_affiliations(profile):
                    data.append(row)
                    
def has_education(profile):
    ''' This tests whether the profile is valid and has education or employe info '''
    try:
        if profile.get('error-code') is None and profile['activities-summary']['educations']['education-summary'] :
            return True
    except:
        return False
    
def has_employment(profile):
    ''' This tests whether the profile is valid and has education or employe info '''
    try:
        if profile.get('error-code') is None and profile['activities-summary']['employments']['employment-summary'] :
            return True
    except:
        return False

def get_affiliations(profile):
    ''' For each profile, extract all affiliations and metadata '''
    profile_data = []
    #in 2018+ affiliations info separated to two keys as educations and employments
    if has_education(profile):
        orcid_id = profile["path"]
        try:
            for aff in profile['activities-summary']['educations']['education-summary']:
                row = [orcid_id]
                row.append(aff["organization"]["address"]["country"])
                try:
                    row.append(aff["organization"]["name"])
                except:
                    row.append(None)
                try:
                    row.append(aff["organization"]["disambiguated-organization"]["disambiguated-organization-identifier"])
                except:
                    row.append(None)
                try:
                    row.append(aff["start-date"]["year"]["value"])
                except:
                    row.append(None)
                try:
                    row.append(aff["end-date"]["year"]["value"])
                except:
                    row.append(None)
                try:
                    row.append("EDUCATION")
                except:
                    row.append(None)
                try:
                    row.append(aff["role-title"])
                except:
                    row.append(None)
                profile_data.append(row)
        except:
            pass
    if has_employment(profile):
        orcid_id = profile["path"]
        try:
            for aff in profile['activities-summary']['employments']['employment-summary']:
                row = [orcid_id]
                row.append(aff["organization"]["address"]["country"])
                try:
                    row.append(aff["organization"]["name"])
                except:
                    row.append(None)
                try:
                    row.append(aff["organization"]["disambiguated-organization"]["disambiguated-organization-identifier"])
                except:
                    row.append(None)
                try:
                    row.append(aff["start-date"]["year"]["value"])
                except:
                    row.append(None)
                try:
                    row.append(aff["end-date"]["year"]["value"])
                except:
                    row.append(None)
                try:
                    row.append("EMPLOYMENT")
                except:
                    row.append(None)
                try:
                    row.append(aff["role-title"])
                except:
                    row.append(None)
                profile_data.append(row)
        except:
            pass
    return profile_data


# In[134]:


#json_dir ="/Users/qianshaoli/ORCID_2018/000" 
#json_files = file_generator(json_dir)
#summary_dir ="/Users/qianshaoli/ORCID_2018_test/" 
summary_dir ="/Users/qianshaoli/ORCID_2018/" 
json_files = file_generator_from_summary(summary_dir)
data = []


# In[ ]:


time%%
get_profiles(data, json_files)


# In[126]:


df=[]
df = pd.DataFrame(data, columns = ["orcid_id", "country", "organization_name", 
                              "Ringgold_id", "start_year", "end_year", 
                              "affiliation_type", "affiliation_role"])
df.head()


# In[109]:


df.orcid_id.nunique(), len(df)


# There are 1627845 researchers with ORCID profiles that include affiliations data, with a total of 4590010 affiliations over the course of their careers.

# In[110]:


education_without_dates = df[((df.affiliation_type == "EDUCATION") & 
                       (df.start_year.isnull()) & 
                       (df.end_year.isnull()))]
len(education_without_dates), education_without_dates.orcid_id.nunique()


# There are 135293 profiles that include EDUCATION affiliations that do not have any start_date or end_date. These researchers are just listing their education affiliations without noting the year they obtained the degree.

# These data stop in December 2018. So affiliations that do have a start_year but no end_year are ongoing affilations. How many are there?

# In[111]:


ongoing = df[((df.start_year.notnull()) & (df.end_year.isnull()))]
len(ongoing), ongoing.orcid_id.nunique()


# There are 1175275 people with ongoing affiliations as of 2018. Let's recode those missing end_year values of ongoing affiliations as 2018.

# In[112]:


def recode_ongoing(row):
    ''' Recode the end_year value of some affiliations to 2018 
        since they are ongoing affiliations. '''
    if row.start_year is not None and row.end_year is None:
        return 2018
    else:
        return row.end_year
    
df.end_year = df.apply(recode_ongoing, axis = 1)


# Next we should exclude people whose country of residence in 2018 is ambiguous, i.e. those with more than one country affilation. How many are there?

# In[113]:


today_affs = df[df.end_year == 2018]
g = today_affs.groupby(["orcid_id", "country"]).aggregate(len).reset_index()
multi_2018_country_people = set(g[g.duplicated("orcid_id")].orcid_id)

len(multi_2018_country_people)


# There are 29075 of these ambiguous people. Let's exclude them, since for the analysis of migrations, we don't know where these people ended up in the present day.

# In[19]:


df = df[~df.orcid_id.isin(multi_2018_country_people)]


# Next, we want to know which of these people got PhD degrees. So let's classify the affiliation_role of the EDUCATION affiliations as being PhD degrees or not, just using simple string matching. I built this classifier through trial and error on these data. I have not yet found an exception, but there are probably some in there. The error rate should be very low.

# In[20]:


def is_phd(role):
    ''' After lowercasing the affiliation_role string, look for
        terms that indicate it is a Ph.D. degree.
        Yes, regular expressions are tidier, but also unreadable 
        to most people and harder to debug. '''
    # These are international synonyms for the Ph.D. degree
    synonyms = ("phd", "ph.d","ph. d", "dphil", "d.phil", "rer. nat", 
                "rer, nat", "doctor rerum", "doktor rerum")
    # This catches things like "Doctorate en Chimie" but
    # excludes "Postdoctoral Fellow" and "Medical Doctorate"
    special_cases_allowed = ("doctor", "doktor")
    special_cases_disallowed = ("pre", "post", "med")
    if (type(role) == str or type(role) == unicode):
        # lowercase the string
        role = role.lower()
        # Look for Ph.D. synonyms
        if any([(i in role) for i in synonyms]):
            return True
        # Look for special cases
        if any([(i in role) for i in special_cases_allowed]) and         not any([(i in role) for i in special_cases_disallowed]):
            return True
    # Otherwise call it False
    return False

df["is_phd"] = df.affiliation_role.apply(is_phd)
df.head()


# In[21]:


len(df), df.orcid_id.nunique(), df.country.nunique()


# We have about 4432687 affiliation observations from 1598770 ORCID profiles. Those affiliations are located in 242 countries, i.e. everywhere.

# In[24]:


df.to_csv('/Users/qianshaoli/Documents/Academic/infm600/week4/dataset/ORCID_migrations_2018.csv', sep='\t', encoding = 'utf-8')


# Next, let's create a data set that summarizes important information about each person.
# 
# This dataframe will be indexed by orcid_id: one row per person. And let's start by generating a phd_year column with the year in which they completed their PhD.
# 
# Note: The value of phd_year will be 2018 for ongoing PhD students.

# In[27]:


df = pd.read_csv('/Users/qianshaoli/Documents/Academic/infm600/week4/dataset/ORCID_migrations_2018.csv', index_col = 0, sep='\t', encoding = 'utf-8')


# In[28]:


people = pd.DataFrame(index = df.orcid_id.unique())
people.index.name = 'orcid_id'
people["phd_year"] = df[(df.is_phd) 
                        & (df.affiliation_type == "EDUCATION")
                       ].groupby("orcid_id").end_year.max()
people.head()


# In[29]:


len(people)


# There you have the year (if any) of 638568 PhD out of the 1598770 ORCID profiles that include affiliations. 
# 
# Now let's determine each person's country of residence in 2018.

# In[30]:


today_countries = df[df.end_year == 2018].drop_duplicates(subset = 'orcid_id', keep = 'first')
today_countries = today_countries.set_index("orcid_id").country
today_countries.name = "country_2018"
today_countries.head()


# In[31]:


people = pd.merge(people, today_countries.to_frame(), how = 'left',
                  left_index = True, right_index = True)
people.head()


# In[32]:


len(people), people.index.nunique()


# Good. So now we can see where each person ended up in 2018, if they have an affiliation that ended in 2018 or is ongoing.
# 
# We don't know the true nationalities of people with ORCID profiles, but we can infer them from the country of their earliest affiliation. So let's find the year and country of each person's earliest affiliation.

# In[34]:


people['earliest_year'] = df.groupby("orcid_id").start_year.min()
people.head()


# In[35]:


earliest_affs = df[df.start_year == df.groupby('orcid_id').start_year.transform(min)]
earliest_affs = earliest_affs.drop_duplicates(subset = 'orcid_id', keep = 'first').set_index('orcid_id').country
earliest_affs.name = 'earliest_country'
people = pd.merge(people, earliest_affs.to_frame(), how = 'left',right_index = True, left_index = True)
people.head()


# Good. Now let's mark people who obtained a PhD, and let's list the country in which they got their PhD.

# In[36]:


people['has_phd'] = df.groupby('orcid_id').is_phd.max()
people.head()


# In[37]:


phd_country = df[(df.affiliation_type == 'EDUCATION') & (df.is_phd)]
phd_country = phd_country.drop_duplicates(subset = 'orcid_id', 
                                      keep = 'first').set_index('orcid_id').country
phd_country.name = 'phd_country'
people = pd.merge(people, phd_country.to_frame(), how = 'left',
                  right_index = True, left_index = True)
people.head()


# Let's get some summary statistics based on these biographical data...

# In[38]:


# total people who have both an earliest country and a 2018 country
len(people[(people.earliest_country.notnull()) & 
           (people.country_2018.notnull())])


# In[ ]:


1054586 people who have both an earliest country and a 2018 country


# In[40]:


# total people in 2018 in a country different from their earliest country
len(people[(people.earliest_country.notnull()) & 
           (people.country_2018.notnull()) &
           (people.country_2018 != people.earliest_country)])


# So about 14.07% of people (148416 / 1054586) live in a country in 2018 different from their earliest affiliation.
# 
# Let's look at the distribution of PhD degrees.

# In[41]:


len(people), len(people[people.has_phd])


# 44%(705948/1598770) of the ORCID profiles that include any affiliations list a PhD degree.
# 
# Where did they get those PhD degrees?

# In[43]:


phds = people[people.has_phd].phd_country.value_counts()
phds.name = "PhDs"
phds = phds.to_frame()
phds["% of total"] = phds.PhDs / len(people[people.has_phd]) * 100
phds.head(10)


# PhDs  % of total
# US  142763   20.222878
# GB   60699    8.598225
# IN   42599    6.034297
# CN   40825    5.783004
# ES   37947    5.375325
# AU   26983    3.822236
# BR   26062    3.691773
# IT   19129    2.709690
# FR   18772    2.659119
# CA   16482    2.334733
# PT   14583    2.065733
# JP   13933    1.973658
# DE   13710    1.942069
# TR   11811    1.673069
# MX   11746    1.663862
# KR   11213    1.588361

# So of the 705948 people with a PhD, 20% got it in the US, 8.5% in the UK, 6.0% in India, 5.7% in China, and 5.3% in Spain.
# 
# NOTE: Clearly some biases in the rate at which people from various countries have created ORCID profiles for themselves. Proceed with caution.
# 
# Save the people data to local directory. They are ready for play. Have fun!

# In[45]:


people.to_csv('/Users/qianshaoli/Documents/Academic/infm600/week4/dataset/ORCID_migrations_2018_by_person.csv',  sep='\t', encoding = 'utf-8')


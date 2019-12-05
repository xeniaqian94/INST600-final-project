##jre version 1.8+
java -jar orcid-conversion-lib-0.0.2-full.jar --tarball -i ORCID-API-2.0_xml_10_2018.tar.gz -v v2_0 -o ORCID-API-2.0_json_10_2018.tar.gz
## 4hours @ i3 dual 1.4g

tar -zxvf ORCID-API-2.0_json_10_2018.tar.gz -C /json
## 3hours @ i3 dual 1.4g
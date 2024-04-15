
I have created a pipeline for acrs. If you could review PR on this branch: ACRS-11 so I could merge to master.
Many thanks. (edited) 

##What?
This is a pipeline for Afghan-Citizens-Resettlement-Scheme, ACRS.  
It includes a .drone.yaml file for the the Drone pipeline, and Quay repository  
Snyk, SonarQube and Cron Jobs for tearing down envs will be added to the source code  
Snyk doesn't scan Docker Images but with web UI we can easily find out the vulnerabilities. It also scans the Kubernetes manifest files. SonarQube is a Code Quality Assurance tool that collects and analyzes source code, and provides reports for the code quality of your project.  
##Why?    
And this pipeline will ensure that the code is build and pushed to quay repo by automation.
How?
I have build a drone pipeline consisting of Github for version control, Drone CI for continuous integration and code build and the snyk and sonarQube scanners will scan the code.
Testing?
Upon completion, the pipeline will be tested end-to-end. 
Screenshots (optional)
Anything Else? (optional)
Testing?
Screenshots (optional)
Anything Else? (optional)
Check list



- [ ] I have reviewed my own pull request
- [ ] I have written tests (if relevant)
- [ ] I have created a JIRA number for my branch
- [ ] I have created a JIRA number for my commit
- [ ] I have followed the chris beams method for my commit https://cbea.ms/git-commit/
- [ ] I will squash the commits before merging

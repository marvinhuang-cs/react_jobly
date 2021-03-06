import React, {useEffect, useState, useContext} from 'react'
import { useParams } from "react-router-dom"
import JoblyApi from './Api'
import CardList from './CardList'
import './Company.css'
import UserContext from "./UserContext";

//individual company information with apply button, passes data down to card list
function Company() {
    const { handle } = useParams();
    const { currentUser } = useContext(UserContext);

    const [company, setCompany] = useState(null);

    useEffect(() => {
        async function getCompanyAndJobs() {
            const c = await JoblyApi.getCompany(handle);
            const { jobs } = currentUser;
            
            //grab IDs of jobs applied to
            const jobsIDsAppliedTo = new Set(jobs.map(job => job.id));
            c.jobs = c.jobs.map(job => ({
                ...job,
                state: jobsIDsAppliedTo.has(job.id) ? "applied" : null
              }));
            

            setCompany(c);
        }
        
        getCompanyAndJobs();
    }, [handle, currentUser])

    async function apply(idx) {
        if (company && Array.isArray(company.jobs) && idx < company.jobs.length) {
          let jobId = company.jobs[idx].id;
          let message = await JoblyApi.applyToJob(jobId);
          setCompany(c => {
            let newCompany = { ...c };
            newCompany.jobs = newCompany.jobs.map(job =>
              job.id === jobId ? { ...job, state: message } : job
            );
            return newCompany;
          });
        }
      }

    if (!company) {
        return <div>Loading...</div>;
      }

    return (
        <div className="body__container">
            <div className="company__container">
            <h3>{company.name}</h3>
            <p>{company.description}</p>
            <CardList cards={company.jobs} apply={apply}/>
            </div>
        </div>
    )
}

export default Company

const taxPeriod = {
    'GSTR3B': 'Monthly',
    'GSTR1': 'Monthly',
    'GSTR2X': 'Quaterly',
    'GSTR9C': 'Annualy',
    'GSTR9': 'Annualy',
    'ITC04': 'Annualy',
}
const gstRet = ['GSTR3B', 'GSTR1', 'GSTR2X', 'TRAN2']
const Months = ['JANUARY', 'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER'];
const Content = (data,details) => {
    
    const tables = data ? Object.keys(data).map((key) => {
        return `<div class='w[44%]'>
        <div class="bg-[#1289a7] rounded-full px-3 py-2 text-white text-center w-64">
        <p>GST Filling Details(${key})</p>
        </div>
        <table class="text-lg text-left rtl:text-right my-5">
        <thead class="text-sm uppercase text-center">
        <tr>
        <th scope="col" class="px-2 py-3">
        Tax Period
        </th>
        <th scope="col" class="px-2 py-3">
        Date of Filing
        </th>
                            <th scope="col" class="px-2 py-3">
                            Status
                            </th>
                        </tr>
                        </thead>
                        <tbody class="text-sm text-center">
                        ${data[key].map((item) => {
            return `
                            <tr> 
                            <td class="px-2 py-2">
                            ${gstRet.includes(key) ? Months[parseInt(item.ret_prd.slice(0, 2)) - 1] : taxPeriod[key]}
                            </td>
                            <td class="px-2 py-2">
                            ${item.dof}
                            </td>
                            <td class="px-2 py-2 ">
                            ${item.status}
                            </td>
                            </tr>`
        }).join('')
            }
                    
                    </tbody>
                </thead>
                </table>
                </div>
                `
    }) : [];
    let file = {
        content: `
                <style>
                .a4-div {
                    width: 210mm;
                    height: 297mm;
                    background-image: url('https://devrunch.github.io/imageRepo/img1.png');
                    background-repeat: repeat-y;
                    background-size: cover;
                }
                
                table,
        th,
        td {
            border: 1px solid black;
            border-collapse: collapse;
        }
        </style>
        <div class="a4-div">
            <div style="width: 180mm; " class="py-5 px-4 pl-6">
                <h1 class="text-left text-4xl font-bold">GST Filing and Compliance Report <br> (${details.prd})</h1>
                <div class="rounded-xl mt-6 p-3 border-[3px] mr-2 border-[#53abc1]" style="background-color: #effcff; background-image: url('https://devrunch.github.io/imageRepo/img3.png'); background-repeat: no-repeat; background-size: contain; background-position: bottom;">
                    <p class="py-1"><span class="font-bold">LEGAL NAME OF BUSINESS :</span> ${details.bsnm}</p>
                    <p class="py-1"><span class="font-bold">ADDRESS : </span> ${details.address}</p>
                    <p class="py-1"><span class="font-bold">TRADE NAME OF BUSINESS:</span> ${details.lgnm}</p>
                    <p class="py-1"><span class="font-bold">CONSTITUTION OF BUSINESS :</span>${details.entityType}</p>
                    <p class="py-1"><span class="font-bold">DEPARTMENT CODE :</span> ${details.departmentCode}</p>
                    <p class="py-1"><span class="font-bold">NATURE OF BUSINESS :</span> ${details.natureOfBusiness}</p>
                    <p class="py-1"><span class="font-bold">REGISTRATION TYPE :</span> ${details.registrationType}</p>
                    <p class="py-1"><span class="font-bold">PINCODE :</span> ${details.pincode}</p>
                    <p class="py-1"><span class="font-bold">PAN :</span> ${details.pan}</p>
                    <p class="py-1"><span class="font-bold">REGISTRATION DATE :</span> ${details.registrationDate} </p>
                </div>
                <div class="mt-10 flex flex-wrap gap-x-3 gap-y-10 justify-around">
                    ${data?tables[0] + tables[1]:''}
                </div>
            </div>
        </div>
    ${data?(tables.length > 2 ?`
        <div class="a4-div">
            <div style="width: 180mm; " class="py-5 px-3 pl-5">
                <div class="mt-10 flex flex-wrap gap-x-3 gap-y-10 justify-around">
                    ${data?tables.slice(2).join(""):``}
                </div>
            </div>
        </div>`:`<div></div>`):''
        }
            <script src="https://cdn.tailwindcss.com"></script>
`
    };
    return file;
}
module.exports = Content;
// html_to_pdf.generatePdfs(file, options).then(output => {

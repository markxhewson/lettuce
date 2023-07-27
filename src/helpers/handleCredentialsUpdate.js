const handleCredentialsUpdate = (e, setFormData) => {
  const { name, value } = e.target;
  setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
};

export default handleCredentialsUpdate;
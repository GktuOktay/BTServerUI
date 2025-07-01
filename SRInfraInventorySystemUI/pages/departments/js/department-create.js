export async function createDepartment(form, manager) {
    const formData = new FormData(form);
    let description = formData.get('department_description');
    if (description === null || description.trim() === '') {
        description = null;
    }
    const departmentData = {
        name: formData.get('department_name'),
        description,
        parentDepartmentId: formData.get('parent_department_id') || null,
        managerPersonnelName: formData.get('manager_name'),
        isActive: true
    };
    try {
        await window.DepartmentAPI.createDepartment(departmentData);
        manager.closeModal();
        manager.loadDepartments();
        manager.showSuccess(window.APIConfig.getSuccessMessage('DEPARTMENT_CREATED'));
    } catch (error) {
        console.error('Departman oluşturma hatası:', error);
        manager.showError(window.APIConfig.formatErrorMessage(error));
    }
}

package uk.co.ivandimitrov.postlist.model;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, String> {

    @Override
    <S extends User> S save(@Param("user") S user);

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    void delete(User user);

}
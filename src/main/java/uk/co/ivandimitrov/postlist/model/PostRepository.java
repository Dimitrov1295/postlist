package uk.co.ivandimitrov.postlist.model;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends PagingAndSortingRepository<Post, String> {

	@Override
	@PreAuthorize("#post?.user == null or #post?.user?.name == authentication?.name")
	<S extends Post> S save(@Param("post") S post);

	@Override
	@PreAuthorize("@postRepository.findById(#id)?.user?.name == authentication?.name")
	void deleteById(@Param("id") String id);

	@Override
	@PreAuthorize("#post?.user?.name == authentication?.name")
	void delete(@Param("post") Post post);

}